import Image from "next/image";
import type { Project } from "@/data/projects";

/**
 * Shows the project's cover image if one is set,
 * otherwise a styled device mock-up in the project's colours.
 */
export default function ProjectVisual({
  project,
  priority = false,
  showLabel = false,
  sizes = "(max-width: 860px) 100vw, 60vw",
}: {
  project: Project;
  priority?: boolean;
  showLabel?: boolean;
  sizes?: string;
}) {
  const [a, b] = project.palette;
  const isMobile = /mobile|ios|android/i.test(project.platform);

  return (
    <div className="work-visual">
      <div className="visual-inner">
        {project.cover ? (
          <Image src={project.cover} alt={`${project.title} preview`} fill sizes={sizes} priority={priority} />
        ) : (
          <div className="ph" style={{ background: `linear-gradient(135deg, ${a}, ${b})` }} aria-hidden="true">
            {showLabel && <span className="ph-label">{project.title}</span>}
            {isMobile ? <Phones color={a} accent={b} /> : <Browser color={a} accent={b} />}
          </div>
        )}
      </div>
    </div>
  );
}

function Browser({ color, accent }: { color: string; accent: string }) {
  return (
    <div className="ph-browser">
      <div className="ph-bar">
        <i />
        <i />
        <i />
      </div>
      <div className="ph-body">
        <div className="ph-side">
          <b style={{ background: color, width: "60%" }} />
          <b />
          <b style={{ width: "70%" }} />
          <b style={{ width: "85%" }} />
          <b style={{ width: "55%" }} />
        </div>
        <div className="ph-main">
          <div className="ph-cards">
            <div style={{ background: `${color}22` }} />
            <div />
            <div style={{ background: `${accent}22` }} />
          </div>
          <div className="ph-chart">
            <svg viewBox="0 0 200 80" preserveAspectRatio="none">
              <path d="M0 62 C30 50 45 58 70 40 S120 28 140 34 S180 12 200 16 L200 80 L0 80Z" fill={`${color}26`} />
              <path d="M0 62 C30 50 45 58 70 40 S120 28 140 34 S180 12 200 16" fill="none" stroke={color} strokeWidth="2" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Phones({ color, accent }: { color: string; accent: string }) {
  return (
    <div className="ph-phones">
      {[0, 1, 2].map((i) => (
        <div className="ph-phone" key={i}>
          <div className="ph-screen">
            <span className="ph-line" style={{ width: "50%" }} />
            <div
              className="ph-pill"
              style={{ background: i === 1 ? `linear-gradient(135deg, ${color}, ${accent})` : `${color}1f` }}
            />
            <span className="ph-line" />
            <span className="ph-line" style={{ width: "80%" }} />
            <span className="ph-line" style={{ width: "65%" }} />
          </div>
        </div>
      ))}
    </div>
  );
}
