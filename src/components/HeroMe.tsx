/**
 * Godson's face in the hero: 8 expressions that react to the visitor.
 * fx.ts (faces) switches data-face and the bubble text.
 */
export const FACES = ["smile", "laugh", "think", "surprised", "focused", "confused", "speaking", "serious"] as const;

export default function HeroMe() {
  return (
    <div className="me" data-face="smile" data-cursor="Poke" role="img" aria-label="Illustrated avatar of Godson Udochukwu">
      <div className="me-tilt">
        {FACES.map((f, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={f}
            className={`me-face face-${f}`}
            src={`/images/me/face-${f}.webp`}
            alt=""
            draggable={false}
            fetchPriority={i === 0 ? "high" : "low"}
          />
        ))}
      </div>
    </div>
  );
}
