// ─────────────────────────────────────────────────────────────
//  All the motion on the site lives here, written as plain DOM code
//  so it works with any markup that has the right data-attributes.
//
//  initFx() wires everything up and returns a cleanup function.
//  - Journey: avatar walks a path drawn down the page as you scroll
//  - Custom cursor, magnetic buttons, card tilt, image parallax
//  - Count-up numbers, scroll progress, velocity marquee, split text
// ─────────────────────────────────────────────────────────────

type Cleanup = () => void;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

export function initFx(): Cleanup {
  const cleanups: Cleanup[] = [];
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;

  cleanups.push(splitText());
  cleanups.push(counters(reduce));
  cleanups.push(scrollProgress());
  if (!reduce) cleanups.push(marquee());
  if (!reduce) cleanups.push(parallax());
  if (finePointer && !reduce) {
    cleanups.push(cursor());
    cleanups.push(magnetic());
    cleanups.push(tilt());
  }
  cleanups.push(avatars(finePointer, reduce));
  cleanups.push(journey(reduce));

  return () => cleanups.forEach((c) => c && c());
}

/* ── Split hero headline into words that rise in ─────────────── */
function splitText(): Cleanup {
  document.querySelectorAll<HTMLElement>("[data-split]").forEach((el) => {
    if (el.dataset.splitDone) return;
    el.dataset.splitDone = "1";
    let i = 0;
    const walk = (node: Node) => {
      [...node.childNodes].forEach((child) => {
        if (child.nodeType === 3) {
          const frag = document.createDocumentFragment();
          (child.textContent || "").split(/(\s+)/).forEach((w) => {
            if (!w) return;
            if (/^\s+$/.test(w)) return frag.appendChild(document.createTextNode(" "));
            const outer = document.createElement("span");
            outer.className = "sw";
            const inner = document.createElement("span");
            inner.className = "sw-in";
            inner.style.setProperty("--i", String(i++));
            inner.textContent = w;
            outer.appendChild(inner);
            frag.appendChild(outer);
          });
          child.replaceWith(frag);
        } else if (child.nodeType === 1) walk(child);
      });
    };
    walk(el);
    el.classList.add("split-ready");
  });
  return () => {};
}

/* ── Count-up numbers ────────────────────────────────────────── */
function counters(reduce: boolean): Cleanup {
  if (reduce || !("IntersectionObserver" in window)) return () => {};
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        const el = e.target as HTMLElement;
        const final = el.dataset.count || el.textContent || "";
        const m = final.match(/^(\D*)(\d+(?:\.\d+)?)(.*)$/);
        if (!m) return;
        const [, pre, num, post] = m;
        const target = parseFloat(num);
        const start = performance.now();
        const dur = 1400;
        const tick = (t: number) => {
          const p = clamp((t - start) / dur, 0, 1);
          const eased = 1 - Math.pow(1 - p, 4);
          el.textContent = pre + Math.round(target * eased) + post;
          if (p < 1) requestAnimationFrame(tick);
          else el.textContent = final;
        };
        requestAnimationFrame(tick);
      }),
    { threshold: 0.6 }
  );
  document.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => io.observe(el));
  return () => io.disconnect();
}

/* ── Top scroll progress bar ─────────────────────────────────── */
function scrollProgress(): Cleanup {
  const bar = document.querySelector<HTMLElement>(".scroll-progress");
  if (!bar) return () => {};
  const on = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
  };
  on();
  addEventListener("scroll", on, { passive: true });
  return () => removeEventListener("scroll", on);
}

/* ── Marquee that speeds up and skews with scroll velocity ───── */
function marquee(): Cleanup {
  const track = document.querySelector<HTMLElement>(".marquee-track");
  if (!track) return () => {};
  track.classList.add("js-marquee");
  let x = 0,
    lastY = scrollY,
    vel = 0,
    raf = 0;
  const loop = () => {
    const dy = scrollY - lastY;
    lastY = scrollY;
    vel = lerp(vel, dy, 0.1);
    const half = track.scrollWidth / 2;
    x -= 0.6 + Math.abs(vel) * 0.5;
    if (x <= -half) x += half;
    track.style.transform = `translate3d(${x}px,0,0) skewX(${clamp(-vel * 0.4, -12, 12)}deg)`;
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);
  return () => cancelAnimationFrame(raf);
}

/* ── Image parallax inside framed visuals ────────────────────── */
function parallax(): Cleanup {
  const els = [...document.querySelectorAll<HTMLElement>("[data-parallax]")];
  if (!els.length) return () => {};
  let raf = 0;
  const loop = () => {
    const vh = innerHeight;
    els.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.bottom < -100 || r.top > vh + 100) return;
      const p = (r.top + r.height / 2 - vh / 2) / vh; // -1..1
      el.style.setProperty("--py", `${clamp(p * -40, -40, 40)}px`);
    });
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);
  return () => cancelAnimationFrame(raf);
}

/* ── Custom cursor ───────────────────────────────────────────── */
function cursor(): Cleanup {
  const dot = document.createElement("div");
  const ring = document.createElement("div");
  dot.className = "cur-dot";
  ring.className = "cur-ring";
  ring.innerHTML = "<span></span>";
  document.body.append(dot, ring);
  document.documentElement.classList.add("has-cursor");
  const label = ring.firstElementChild as HTMLElement;
  let mx = innerWidth / 2,
    my = innerHeight / 2,
    rx = mx,
    ry = my,
    raf = 0,
    seen = false;
  const move = (e: PointerEvent) => {
    mx = e.clientX;
    my = e.clientY;
    if (!seen) {
      seen = true;
      rx = mx;
      ry = my;
      document.documentElement.classList.add("cursor-on");
    }
    const t = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor], a, button");
    ring.classList.toggle("is-link", !!t && !t.dataset.cursor);
    ring.classList.toggle("is-label", !!t?.dataset.cursor);
    label.textContent = t?.dataset.cursor || "";
  };
  const leave = () => document.documentElement.classList.remove("cursor-on");
  const enter = () => seen && document.documentElement.classList.add("cursor-on");
  const down = () => ring.classList.add("is-down");
  const up = () => ring.classList.remove("is-down");
  const loop = () => {
    rx = lerp(rx, mx, 0.18);
    ry = lerp(ry, my, 0.18);
    dot.style.transform = `translate3d(${mx}px,${my}px,0)`;
    ring.style.transform = `translate3d(${rx}px,${ry}px,0)`;
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);
  addEventListener("pointermove", move, { passive: true });
  document.addEventListener("pointerleave", leave);
  document.addEventListener("pointerenter", enter);
  addEventListener("pointerdown", down);
  addEventListener("pointerup", up);
  return () => {
    cancelAnimationFrame(raf);
    removeEventListener("pointermove", move);
    document.removeEventListener("pointerleave", leave);
    document.removeEventListener("pointerenter", enter);
    removeEventListener("pointerdown", down);
    removeEventListener("pointerup", up);
    dot.remove();
    ring.remove();
    document.documentElement.classList.remove("has-cursor", "cursor-on");
  };
}

/* ── Magnetic buttons ────────────────────────────────────────── */
function magnetic(): Cleanup {
  const els = [...document.querySelectorAll<HTMLElement>("[data-magnetic]")];
  const offs: Cleanup[] = els.map((el) => {
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${x * 0.3}px, ${y * 0.4}px)`;
    };
    const out = () => (el.style.transform = "");
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", out);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", out);
      el.style.transform = "";
    };
  });
  return () => offs.forEach((o) => o());
}

/* ── 3D tilt on project visuals ──────────────────────────────── */
function tilt(): Cleanup {
  const els = [...document.querySelectorAll<HTMLElement>("[data-tilt]")];
  const offs: Cleanup[] = els.map((el) => {
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(900px) rotateY(${px * 10}deg) rotateX(${-py * 10}deg) scale(1.02)`;
      el.style.setProperty("--gx", `${(px + 0.5) * 100}%`);
      el.style.setProperty("--gy", `${(py + 0.5) * 100}%`);
    };
    const out = () => (el.style.transform = "");
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", out);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", out);
    };
  });
  return () => offs.forEach((o) => o());
}

/* ── The journey: avatar walking down a drawn path ───────────── */
function journey(reduce: boolean): Cleanup {
  const rootEl = document.querySelector<HTMLElement>(".jr");
  if (!rootEl) return () => {};
  const root: HTMLElement = rootEl;
  const svg = root.querySelector<SVGSVGElement>(".jr-svg")!;
  const track = root.querySelector<SVGPathElement>(".jr-track")!;
  const done = root.querySelector<SVGPathElement>(".jr-done")!;
  const stopsG = root.querySelector<SVGGElement>(".jr-stops")!;
  const char = root.querySelector<HTMLElement>(".jr-char")!;
  const flip = root.querySelector<HTMLElement>(".jr-flip")!;
  const bubble = root.querySelector<HTMLElement>(".jr-bubble")!;
  const bubbleText = bubble.querySelector("span")!;
  const legF = root.querySelector<SVGGElement>(".wb-leg-f")!;
  const legB = root.querySelector<SVGGElement>(".wb-leg-b")!;
  const armF = root.querySelector<SVGGElement>(".wb-arm-f")!;
  const armB = root.querySelector<SVGGElement>(".wb-arm-b")!;
  const fig = root.querySelector<HTMLElement>(".jr-fig")!;
  const head = root.querySelector<HTMLElement>(".ah-walker")!;
  let lookX = 0;

  type Stop = { len: number; say: string; el: SVGCircleElement | null; wave: boolean };
  let mode: "path" | "bar" = "path";
  let ys: number[] = [],
    xs: number[] = [],
    lens: number[] = [],
    total = 0,
    stops: Stop[] = [],
    cur = -1,
    phase = 0,
    amp = 0,
    dir = 1,
    lastX = 0,
    chapter = -1,
    waving = false,
    bubbleTimer = 0,
    raf = 0,
    lastScroll = scrollY,
    idleFor = 0,
    built = false,
    hasStart = false;
  const CHAR_H = () => char.offsetHeight || 92;

  function firstContent(el: HTMLElement): HTMLElement {
    const box = el.matches(".container") ? el : el.querySelector<HTMLElement>(".container") || el;
    return (box.firstElementChild as HTMLElement) || el;
  }

  function chapters() {
    return [...document.querySelectorAll<HTMLElement>("[data-chapter]")].filter((el) => el.getClientRects().length > 0).map((el) => ({
      // where this chapter's visible content starts (skips top padding)
      top:
        firstContent(el).getBoundingClientRect().top +
        scrollY -
        28,
      say: el.dataset.say || "",
      wave: el.hasAttribute("data-wave"),
    }));
  }

  function build() {
    const vw = document.documentElement.clientWidth;
    const docH = document.documentElement.scrollHeight;
    mode = vw < 1024 ? "bar" : "path";
    root.dataset.mode = mode;
    const chs = chapters();
    stops = [];
    stopsG.innerHTML = "";

    if (mode === "bar") {
      track.setAttribute("d", "");
      done.setAttribute("d", "");
      svg.style.height = "0";
      const max = Math.max(1, docH - innerHeight);
      chs.forEach((c) =>
        stops.push({ len: clamp((c.top - innerHeight * 0.5) / max, 0, 1), say: c.say, el: null, wave: c.wave })
      );
      if (stops.length) stops[0].len = 0;
      hasStart = !!document.querySelector("[data-journey-start]");
      built = true;
      return;
    }

    const box = document.querySelector<HTMLElement>("main .container");
    let contentLeft = 120;
    if (box) {
      const r = box.getBoundingClientRect();
      contentLeft = r.left + parseFloat(getComputedStyle(box).paddingLeft);
    }
    const L = clamp(contentLeft / 2, 34, 160);
    const R = vw - L;
    svg.setAttribute("viewBox", `0 0 ${vw} ${docH}`);
    svg.style.height = docH + "px";
    svg.style.width = vw + "px";

    const startEl = document.querySelector<HTMLElement>("[data-journey-start]");
    let startX = L,
      startY = 150;
    if (startEl && startEl.getClientRects().length) {
      const r = startEl.getBoundingClientRect();
      startX = r.left + r.width / 2;
      startY = r.bottom + scrollY - 10;
    }
    const firstSide = startX > vw / 2 ? R : L;
    let d = `M ${startX} ${startY}`;
    let x = startX,
      y = startY;
    if (Math.abs(startX - firstSide) > 1) {
      d += ` C ${startX} ${startY + 60}, ${firstSide} ${startY + 20}, ${firstSide} ${startY + 110}`;
      x = firstSide;
      y = startY + 110;
    }
    hasStart = !!startEl;
    const wiggle = (toY: number, sx: number) => {
      // gentle S-curves down a lane
      const seg = 420;
      let k = 0;
      while (y + seg < toY) {
        const ny = y + seg;
        const off = (k % 2 ? -1 : 1) * 16;
        d += ` C ${sx + off} ${y + seg * 0.35}, ${sx - off} ${y + seg * 0.65}, ${sx} ${ny}`;
        y = ny;
        k++;
      }
      if (toY > y) {
        d += ` L ${sx} ${toY}`;
        y = toY;
      }
    };
    const anchors: { y: number; say: string; wave: boolean }[] = [];
    chs.forEach((c, i) => {
      const side = (i % 2 === 0) === (firstSide === L) ? L : R;
      if (i === 0) {
        anchors.push({ y: startY, say: c.say, wave: c.wave });
        return;
      }
      const b = Math.max(c.top, y + 220);
      wiggle(b - 150, x);
      // crossing over to the other side of the page, in the gap above the chapter
      const toX = side;
      d += ` C ${x} ${b - 50}, ${toX} ${b - 100}, ${toX} ${b}`;
      x = toX;
      y = b;
      anchors.push({ y: b, say: c.say, wave: c.wave });
    });
    wiggle(Math.max(y + 10, docH - 60), x);

    track.setAttribute("d", d);
    done.setAttribute("d", d);
    total = track.getTotalLength();
    done.style.strokeDasharray = `${total} ${total}`;

    ys = [];
    xs = [];
    lens = [];
    for (let l = 0; l <= total; l += 5) {
      const p = track.getPointAtLength(l);
      ys.push(p.y);
      xs.push(p.x);
      lens.push(l);
    }
    // monotonic y for binary search
    for (let i = 1; i < ys.length; i++) if (ys[i] < ys[i - 1]) ys[i] = ys[i - 1];

    anchors.forEach((a) => {
      const len = lenAtY(a.y);
      const p = track.getPointAtLength(len);
      const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      c.setAttribute("cx", String(p.x));
      c.setAttribute("cy", String(p.y));
      c.setAttribute("r", "7");
      c.setAttribute("class", "jr-stop");
      stopsG.appendChild(c);
      stops.push({ len, say: a.say, el: c, wave: a.wave });
    });
    built = true;
  }

  function lenAtY(ty: number) {
    if (!ys.length) return 0;
    if (ty <= ys[0]) return 0;
    if (ty >= ys[ys.length - 1]) return lens[lens.length - 1];
    let lo = 0,
      hi = ys.length - 1;
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      if (ys[mid] < ty) lo = mid;
      else hi = mid;
    }
    const t = (ty - ys[lo]) / Math.max(0.001, ys[hi] - ys[lo]);
    return lerp(lens[lo], lens[hi], t);
  }

  function pointAt(len: number) {
    const i = clamp(Math.round(len / 5), 0, xs.length - 1);
    return { x: xs[i], y: ys[i] };
  }

  function say(text: string, sticky = false) {
    if (!text) return;
    bubbleText.textContent = text;
    bubble.classList.remove("show");
    void bubble.offsetWidth;
    bubble.classList.add("show");
    clearTimeout(bubbleTimer);
    if (!sticky) bubbleTimer = window.setTimeout(() => bubble.classList.remove("show"), 3600);
  }

  function pose(a: number, bob: number) {
    legF.setAttribute("transform", `rotate(${a} 42 8)`);
    legB.setAttribute("transform", `rotate(${-a} 42 8)`);
    armB.setAttribute("transform", `rotate(${a * 0.8} 42.5 -14)`);
    armF.setAttribute("transform", `rotate(${-a * 0.8} 42.5 -14)`);
    fig.style.transform = `translateY(${-bob}px) rotate(${a * 0.12}deg)`;
    // the head looks where he's walking
    lookX = lerp(lookX, Math.abs(a) > 1 || amp > 2 ? dir * 0.8 : 0, 0.08);
    head.style.setProperty("--lx", lookX.toFixed(3));
    head.style.setProperty("--ly", "0.12");
  }

  function frame(now: number) {
    if (!built) build();
    const scrollDelta = scrollY - lastScroll;
    lastScroll = scrollY;

    let target: number;
    let px: number, py: number;
    if (mode === "path") {
      target = lenAtY(scrollY + innerHeight * 0.62);
      if (cur < 0) cur = target;
      const prev = cur;
      cur = reduce ? target : lerp(cur, target, 0.12);
      const moved = Math.abs(cur - prev);
      const p = pointAt(cur);
      px = p.x;
      py = p.y;
      const dx = px - lastX;
      lastX = px;
      if (Math.abs(dx) > 0.6) dir = dx > 0 ? 1 : -1;
      else if (moved > 0.3) dir = target > prev ? 1 : -1;
      step(moved, Math.abs(dx) > 2 ? Math.min(14, Math.abs(dx) * 0.9) : 0);
      char.style.transform = `translate3d(${px - char.offsetWidth / 2}px, ${py - CHAR_H()}px, 0)`;
      char.style.opacity = hasStart ? String(clamp((scrollY - 30) / 140, 0, 1)) : "1";
      done.style.strokeDashoffset = String(total - cur);
      let idx = -1;
      stops.forEach((s, i) => {
        const on = cur >= s.len - 2;
        s.el?.classList.toggle("on", on);
        if (on) idx = i;
      });
      onChapter(idx, px);
    } else {
      const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      target = clamp(scrollY / max, 0, 1);
      if (cur < 0) cur = target;
      const prev = cur;
      cur = reduce ? target : lerp(cur, target, 0.14);
      const vw = document.documentElement.clientWidth;
      const w = char.offsetWidth;
      px = 16 + cur * (vw - 32 - w) + w / 2;
      const movedPx = Math.abs(cur - prev) * (vw - 32 - w);
      if (Math.abs(scrollDelta) > 0.5) dir = scrollDelta > 0 ? 1 : -1;
      step(movedPx * 1.4 + Math.min(4, Math.abs(scrollDelta) * 0.2), 0);
      char.style.transform = `translate3d(${px - w / 2}px, 0, 0)`;
      char.style.opacity = hasStart ? String(clamp((scrollY - 40) / 160, 0, 1)) : "1";
      root.style.setProperty("--bar", String(cur));
      let idx = -1;
      stops.forEach((s, i) => {
        if (cur >= s.len - 0.001) idx = i;
      });
      onChapter(idx, px);
    }
    flip.style.transform = `scaleX(${dir})`;
    raf = requestAnimationFrame(frame);
    void now;
  }

  function step(moved: number, hop: number) {
    const walking = moved > 0.25;
    if (walking) {
      idleFor = 0;
      phase += moved / 7;
      amp = lerp(amp, clamp(12 + moved * 2, 12, 30), 0.25);
    } else {
      idleFor++;
      amp = lerp(amp, 0, 0.15);
    }
    if (reduce) amp = 0;
    const a = Math.sin(phase) * amp;
    const bob = Math.abs(Math.cos(phase)) * (amp / 30) * 2.5 + hop;
    pose(a, bob);
    root.classList.toggle("walking", walking);
  }

  function onChapter(idx: number, px: number) {
    const vw = document.documentElement.clientWidth;
    if (hasStart && scrollY < 110) {
      // still standing in the hero: the big avatar does the talking
      if (chapter !== -1) bubble.classList.remove("show");
      chapter = -1;
      return;
    }
    bubble.classList.toggle("left", px > vw / 2);
    if (idx === chapter) return;
    chapter = idx;
    const s = stops[idx];
    if (!s) return;
    waving = s.wave;
    root.classList.toggle("waving", waving);
    head.dataset.mood = "happy";
    window.setTimeout(() => {
      if (!waving) head.dataset.mood = "";
    }, 1600);
    say(s.say, s.wave);
  }

  let resizeT = 0;
  const rebuild = () => {
    clearTimeout(resizeT);
    resizeT = window.setTimeout(() => {
      built = false;
    }, 120);
  };
  const ro = new ResizeObserver(rebuild);
  ro.observe(document.body);
  addEventListener("resize", rebuild);

  root.classList.add("ready");
  raf = requestAnimationFrame(frame);

  return () => {
    cancelAnimationFrame(raf);
    clearTimeout(bubbleTimer);
    ro.disconnect();
    removeEventListener("resize", rebuild);
    root.classList.remove("ready");
  };
}

/* ── Living avatar: eyes follow the cursor, blinks, moods ────── */
function avatars(finePointer: boolean, reduce: boolean): Cleanup {
  const heads = [...document.querySelectorAll<HTMLElement>(".ah")];
  if (!heads.length) return () => {};
  const timers: number[] = [];
  let px = innerWidth * 0.5,
    py = innerHeight * 0.35,
    hasPointer = false,
    raf = 0;

  // blinking for every head, at natural random intervals
  heads.forEach((h) => {
    const blink = () => {
      h.classList.add("blink");
      timers.push(window.setTimeout(() => h.classList.remove("blink"), 130));
      if (Math.random() < 0.2) {
        timers.push(window.setTimeout(() => h.classList.add("blink"), 260));
        timers.push(window.setTimeout(() => h.classList.remove("blink"), 390));
      }
      timers.push(window.setTimeout(blink, 2200 + Math.random() * 3800));
    };
    if (!reduce) timers.push(window.setTimeout(blink, 900 + Math.random() * 1500));
  });

  const lookers = heads.filter((h) => !h.classList.contains("ah-walker"));
  const state = lookers.map(() => ({ x: 0, y: 0 }));

  const move = (e: PointerEvent) => {
    px = e.clientX;
    py = e.clientY;
    hasPointer = true;
  };
  addEventListener("pointermove", move, { passive: true });

  // idle wandering when there's no mouse (phones) or it has gone still
  let wanderX = 0,
    wanderY = 0,
    lastMove = 0;
  const wander = () => {
    wanderX = (Math.random() - 0.5) * 1.4;
    wanderY = (Math.random() - 0.5) * 0.8;
    timers.push(window.setTimeout(wander, 1400 + Math.random() * 2200));
  };
  wander();
  const touch = () => (lastMove = performance.now());
  addEventListener("pointermove", touch, { passive: true });

  // moods from what the visitor is doing
  const moodOn = (e: Event) => {
    const t = (e.target as HTMLElement).closest?.("a, button, [data-cursor]");
    lookers.forEach((h) => {
      if (h.dataset.mood === "surprised") return;
      h.dataset.mood = t ? "happy" : "";
    });
  };
  if (finePointer) document.addEventListener("pointerover", moodOn);

  const clickOff: Cleanup[] = lookers.map((h) => {
    const lines = (h.dataset.lines || "").split("|").filter(Boolean);
    let n = 0;
    const bubble = h.parentElement?.querySelector<HTMLElement>(".hero-bubble span");
    const click = () => {
      h.dataset.mood = "surprised";
      h.classList.remove("boing");
      void h.offsetWidth;
      h.classList.add("boing");
      if (bubble && lines.length) {
        bubble.textContent = lines[n++ % lines.length];
        bubble.parentElement!.classList.remove("pop");
        void bubble.parentElement!.offsetWidth;
        bubble.parentElement!.classList.add("pop");
      }
      timers.push(window.setTimeout(() => (h.dataset.mood = "happy"), 650));
      timers.push(window.setTimeout(() => (h.dataset.mood = ""), 2200));
    };
    h.addEventListener("click", click);
    return () => h.removeEventListener("click", click);
  });

  const loop = () => {
    const idle = !hasPointer || performance.now() - lastMove > 4000;
    lookers.forEach((h, i) => {
      const r = h.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      let tx: number, ty: number;
      if (idle) {
        tx = wanderX;
        ty = wanderY;
      } else {
        const cx = r.left + r.width * 0.5;
        const cy = r.top + r.height * 0.46;
        const dx = px - cx,
          dy = py - cy;
        const dist = Math.hypot(dx, dy) || 1;
        const k = clamp(dist / (r.width * 1.2), 0, 1);
        tx = (dx / dist) * k;
        ty = (dy / dist) * k;
      }
      const s = state[i];
      s.x = lerp(s.x, tx, reduce ? 1 : 0.12);
      s.y = lerp(s.y, ty, reduce ? 1 : 0.12);
      h.style.setProperty("--lx", s.x.toFixed(3));
      h.style.setProperty("--ly", s.y.toFixed(3));
    });
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);

  return () => {
    cancelAnimationFrame(raf);
    timers.forEach(clearTimeout);
    removeEventListener("pointermove", move);
    removeEventListener("pointermove", touch);
    document.removeEventListener("pointerover", moodOn);
    clickOff.forEach((c) => c());
  };
}
