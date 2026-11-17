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
  cleanups.push(faces(finePointer, reduce));
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
  const fig = root.querySelector<HTMLElement>(".jr-fig")!;
  const sprites = new Map<string, HTMLElement>();
  root.querySelectorAll<HTMLElement>(".jr-pose").forEach((img) => sprites.set(img.dataset.name || "", img));
  // which way each pose faces in its artwork: 1 = right, -1 = left, 0 = either
  const FACING: Record<string, number> = { walk: -1, back: 1, point: 1, "a-point": -1, holo: -1, laptop: 1 };
  let shown = "";
  let walkHold = 0;
  let goingUp = false;

  type Stop = { len: number; say: string; el: SVGCircleElement | null; wave: boolean; pose: string };
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
      pose: el.dataset.pose || "stand",
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
        stops.push({ len: clamp((c.top - innerHeight * 0.5) / max, 0, 1), say: c.say, el: null, wave: c.wave, pose: c.pose })
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
    const anchors: { y: number; say: string; wave: boolean; pose: string }[] = [];
    chs.forEach((c, i) => {
      const side = (i % 2 === 0) === (firstSide === L) ? L : R;
      if (i === 0) {
        anchors.push({ y: startY, say: c.say, wave: c.wave, pose: c.pose });
        return;
      }
      const b = Math.max(c.top, y + 220);
      wiggle(b - 150, x);
      // crossing over to the other side of the page, in the gap above the chapter
      const toX = side;
      d += ` C ${x} ${b - 50}, ${toX} ${b - 100}, ${toX} ${b}`;
      x = toX;
      y = b;
      anchors.push({ y: b, say: c.say, wave: c.wave, pose: c.pose });
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
      stops.push({ len, say: a.say, el: c, wave: a.wave, pose: a.pose });
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

  function show(name: string) {
    if (name === shown || !sprites.has(name)) return;
    sprites.get(shown)?.classList.remove("on");
    sprites.get(name)!.classList.add("on");
    if (name !== "walk" && name !== "back") {
      fig.classList.remove("pop");
      void fig.offsetWidth;
      fig.classList.add("pop");
    }
    shown = name;
  }

  function pose(a: number, bob: number, px: number) {
    const walking = walkHold > 0 && !reduce;
    const name = walking ? (goingUp ? "back" : "walk") : stops[chapter]?.pose || "stand";
    show(name);
    if (walking) {
      fig.style.transform = `translateY(${-bob}px) rotate(${a * 0.12}deg)`;
      flip.style.transform = `scaleX(${(FACING[name] || 1) * dir})`;
    } else {
      fig.style.transform = "";
      // strike the pose facing the content in the middle of the page
      const towardCenter = px < document.documentElement.clientWidth / 2 ? 1 : -1;
      flip.style.transform = `scaleX(${FACING[name] ? FACING[name] * towardCenter : 1})`;
    }
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
      cur = reduce || Math.abs(target - cur) < 4 ? target : lerp(cur, target, 0.14);
      const moved = Math.abs(cur - prev);
      const p = pointAt(cur);
      px = p.x;
      py = p.y;
      const dx = px - lastX;
      lastX = px;
      if (moved > 0.3) goingUp = target < prev;
      if (Math.abs(dx) > 0.6) dir = dx > 0 ? 1 : -1;
      else if (moved > 0.3) dir = goingUp ? -1 : 1;
      step(moved, Math.abs(dx) > 2 ? Math.min(14, Math.abs(dx) * 0.9) : 0, px);
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
      if (Math.abs(scrollDelta) > 0.5) {
        dir = scrollDelta > 0 ? 1 : -1;
        goingUp = scrollDelta < 0;
      }
      step(movedPx * 1.4 + Math.min(4, Math.abs(scrollDelta) * 0.2), 0, px);
      char.style.transform = `translate3d(${px - w / 2}px, 0, 0)`;
      char.style.opacity = hasStart ? String(clamp((scrollY - 40) / 160, 0, 1)) : "1";
      root.style.setProperty("--bar", String(cur));
      let idx = -1;
      stops.forEach((s, i) => {
        if (cur >= s.len - 0.001) idx = i;
      });
      onChapter(idx, px);
    }
    raf = requestAnimationFrame(frame);
    void now;
  }

  function step(moved: number, hop: number, px: number) {
    const walking = moved > 0.5;
    walkHold = walking ? 10 : Math.max(0, walkHold - 1);
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
    const bob = Math.abs(Math.cos(phase)) * (amp / 30) * 6 + hop;
    pose(a, bob, px);
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

/* ── Hero face: expressions that react to the visitor ────────── */
function faces(finePointer: boolean, reduce: boolean): Cleanup {
  const me = document.querySelector<HTMLElement>(".me");
  if (!me) return () => {};
  const tiltEl = me.querySelector<HTMLElement>(".me-tilt")!;
  const bubble = document.querySelector<HTMLElement>(".hero-bubble");
  const text = bubble?.querySelector("span");
  const timers: number[] = [];
  const later = (fn: () => void, ms: number) => timers.push(window.setTimeout(fn, ms));

  const base = "smile";
  let hold = 0; // until when a reaction holds before returning to base
  let lastLine = "";
  function set(face: string, line?: string, ms = 1800) {
    me!.dataset.face = face;
    hold = performance.now() + ms;
    if (line && text && line !== lastLine) {
      lastLine = line;
      text.textContent = line;
      bubble!.classList.remove("pop");
      void bubble!.offsetWidth;
      bubble!.classList.add("pop");
    }
  }

  // what he says when the visitor hovers things
  const hoverLines: [string, string, string][] = [
    ["a[href='#work']", "speaking", "Ooh, good choice. Let's go!"],
    ["a[href^='mailto:']", "laugh", "Yes! Let's talk."],
    [".nav-links a, .mobile-menu a", "focused", "Know where you're headed? Respect."],
    [".theme-toggle, .nav-actions .icon-btn", "surprised", "Lights! Dark or light, I'm ready."],
    ["a, button", "smile", ""],
  ];
  const over = (e: Event) => {
    const t = e.target as HTMLElement;
    if (!t.closest || t.closest(".me")) return;
    const r = me.getBoundingClientRect();
    if (r.bottom < 0) return; // hero scrolled away
    for (const [sel, face, line] of hoverLines) {
      if (t.closest(sel)) {
        set(face, line || undefined, 2200);
        return;
      }
    }
  };

  // clicking him cycles reactions
  const pokes: [string, string][] = [
    ["surprised", "Whoa! You found me."],
    ["laugh", "Haha, that tickles!"],
    ["speaking", "I design products people actually enjoy using."],
    ["think", "What should we build together...?"],
    ["focused", "Okay, back to work. Scroll down!"],
    ["confused", "You really like clicking, huh?"],
  ];
  let poke = 0;
  const click = () => {
    const [face, line] = pokes[poke++ % pokes.length];
    me.classList.remove("boing");
    void me.offsetWidth;
    me.classList.add("boing");
    set(face, line, 2600);
  };

  // idle moods: thinking when the visitor goes quiet, confused when the mouse leaves
  let lastActive = performance.now();
  let idleStage = 0;
  const active = () => {
    lastActive = performance.now();
    if (idleStage) {
      idleStage = 0;
      set("laugh", "Oh hey, you're back!", 1600);
    }
  };
  const leave = (e: PointerEvent) => {
    if (!e.relatedTarget) set("confused", "Wait, where did you go?", 4000);
  };

  // gentle 3D tilt toward the cursor
  let tx = 0,
    ty = 0,
    cx = 0,
    cy = 0,
    raf = 0;
  const move = (e: PointerEvent) => {
    const r = me.getBoundingClientRect();
    tx = clamp((e.clientX - (r.left + r.width / 2)) / innerWidth, -1, 1);
    ty = clamp((e.clientY - (r.top + r.height / 2)) / innerHeight, -1, 1);
  };
  const loop = (now: number) => {
    cx = lerp(cx, tx, 0.08);
    cy = lerp(cy, ty, 0.08);
    if (!reduce) tiltEl.style.transform = `perspective(900px) rotateY(${cx * 14}deg) rotateX(${-cy * 8}deg) translate(${cx * 8}px, ${cy * 5}px)`;
    const quiet = now - lastActive;
    if (quiet > 7000 && idleStage === 0) {
      idleStage = 1;
      set("think", "Hmm... what should I design next?", 4500);
    } else if (quiet > 14000 && idleStage === 1) {
      idleStage = 2;
      set("serious", "Still here? Scroll down, there's more.", 6000);
    }
    if (now > hold && me.dataset.face !== base && idleStage === 0) me.dataset.face = base;
    raf = requestAnimationFrame(loop);
  };

  if (finePointer) {
    document.addEventListener("pointerover", over);
    addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
  }
  addEventListener("pointermove", active, { passive: true });
  addEventListener("scroll", active, { passive: true });
  addEventListener("keydown", active);
  me.addEventListener("click", click);
  later(() => set("speaking", "Hey, I'm Godson! Poke me.", 2400), 1400);
  raf = requestAnimationFrame(loop);

  return () => {
    cancelAnimationFrame(raf);
    timers.forEach(clearTimeout);
    document.removeEventListener("pointerover", over);
    removeEventListener("pointermove", move);
    document.documentElement.removeEventListener("pointerleave", leave);
    removeEventListener("pointermove", active);
    removeEventListener("scroll", active);
    removeEventListener("keydown", active);
    me.removeEventListener("click", click);
  };
}
