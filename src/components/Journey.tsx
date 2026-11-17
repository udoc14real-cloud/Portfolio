/**
 * The scroll journey: a path drawn down the page and Godson walking along it.
 * He walks between chapters and strikes a pose at each one.
 * Any element with data-chapter becomes a stop: data-say is his line there,
 * data-pose is the pose he strikes. Behaviour lives in src/lib/fx.ts.
 */

// height of each pose relative to a standing pose
export const POSES: Record<string, number> = {
  stand: 1,
  walk: 1,
  back: 1,
  wave: 1,
  point: 1,
  holo: 1,
  sit: 0.83,
  "a-wave": 1,
  think: 0.925,
  crossed: 1,
  laptop: 0.785,
  "a-point": 1,
};

export default function Journey() {
  return (
    <div className="jr" aria-hidden="true">
      <svg className="jr-svg" xmlns="http://www.w3.org/2000/svg">
        <path className="jr-track" d="" />
        <path className="jr-done" d="" />
        <g className="jr-stops" />
      </svg>
      <div className="jr-bar">
        <div className="jr-bar-fill" />
      </div>
      <div className="jr-char">
        <div className="jr-body">
          <div className="jr-bubble">
            <span>Hey!</span>
          </div>
          <div className="jr-fig" data-pose="stand">
            <div className="jr-flip">
              {Object.entries(POSES).map(([name, h]) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={name}
                  className={`jr-pose pose-${name}`}
                  data-name={name}
                  src={`/images/me/pose-${name}.webp`}
                  alt=""
                  draggable={false}
                  style={{ height: `${h * 100}%` }}
                />
              ))}
            </div>
          </div>
          <div className="jr-shadow" />
        </div>
      </div>
    </div>
  );
}
