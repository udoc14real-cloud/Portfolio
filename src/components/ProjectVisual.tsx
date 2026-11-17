import Image from "next/image";
import type { Project } from "@/data/projects";

/** Framed project cover with parallax image, optional 3D tilt and glare. */
export default function ProjectVisual({
  project,
  priority = false,
  tilt = false,
  sizes = "(max-width: 860px) 100vw, 60vw",
}: {
  project: Project;
  priority?: boolean;
  tilt?: boolean;
  sizes?: string;
}) {
  const [a, b] = project.palette;
  return (
    <div
      className="work-visual"
      data-tilt={tilt ? "" : undefined}
      style={{ background: `linear-gradient(135deg, ${a}, ${b})` }}
    >
      <div className="visual-inner" data-parallax="">
        <Image src={project.cover} alt={`${project.title} cover`} fill sizes={sizes} priority={priority} />
      </div>
      <div className="glare" />
    </div>
  );
}
