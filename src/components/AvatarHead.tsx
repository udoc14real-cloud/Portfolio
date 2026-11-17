import layout from "../../public/images/avatar/layout.json";

/**
 * Godson's 3D avatar, rebuilt from layers so it can come alive:
 * eyes follow the cursor, eyelids blink and squint, the head turns.
 * Behaviour lives in src/lib/fx.ts (avatars + journey).
 *
 * Moods (set with data-mood): "happy" | "surprised" | "" (neutral)
 */
const S = layout.size[0];
const pct = (v: number) => `${((v / S) * 100).toFixed(3)}%`;

function Eye({ side }: { side: "L" | "R" }) {
  const e = side === "L" ? layout.eyeL : layout.eyeR;
  const [x, y, w, h] = e.box;
  const [cx, cy, r] = e.iris;
  return (
    <div
      className="ah-eye"
      style={{
        left: pct(x),
        top: pct(y),
        width: pct(w),
        height: pct(h),
        WebkitMaskImage: `url(/images/avatar/eye${side}-mask.png)`,
        maskImage: `url(/images/avatar/eye${side}-mask.png)`,
      }}
    >
      <div
        className="ah-iris"
        style={{
          left: `${(((cx - r - x) / w) * 100).toFixed(2)}%`,
          top: `${(((cy - r - y) / h) * 100).toFixed(2)}%`,
          width: `${(((2 * r) / w) * 100).toFixed(2)}%`,
          height: `${(((2 * r) / h) * 100).toFixed(2)}%`,
          backgroundImage: `url(/images/avatar/iris${side}.png)`,
        }}
      />
      <div className="ah-lid ah-lid-top" />
      <div className="ah-lid ah-lid-low" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="ah-lash" src={`/images/avatar/eye${side}-lash.png`} alt="" />
    </div>
  );
}

export default function AvatarHead({
  className = "",
  label,
  "data-lines": lines,
}: {
  className?: string;
  label?: string;
  "data-lines"?: string;
}) {
  return (
    <div
      className={`ah ${className}`}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      data-lines={lines}
      data-cursor={lines ? "Poke" : undefined}
    >
      <div className="ah-head">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="ah-base" src="/images/avatar/base.webp" alt="" draggable={false} />
        <Eye side="L" />
        <Eye side="R" />
      </div>
    </div>
  );
}
