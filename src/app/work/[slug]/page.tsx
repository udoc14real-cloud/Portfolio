import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import ProjectVisual from "@/components/ProjectVisual";
import { featuredProjects, getProject } from "@/data/projects";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return featuredProjects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return { title: p.title, description: p.summary || p.tagline };
}

const BehanceBtn = ({ href, primary = false }: { href: string; primary?: boolean }) => (
  <a href={href} target="_blank" rel="noreferrer" className={`btn ${primary ? "btn-primary" : ""}`} data-magnetic="" data-cursor="Behance ↗">
    <span className="be-mark">Bē</span> Full case study on Behance ↗
  </a>
);

export default async function CaseStudy({ params }: { params: Params }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const idx = featuredProjects.findIndex((p) => p.slug === slug);
  const next = featuredProjects[(idx + 1) % featuredProjects.length];

  return (
    <article>
      <section className="cs-hero" data-chapter="Intro" data-say={`Let me walk you through ${project.title}.`}>
        <div className="container">
          <Link href="/#work" className="back">
            ← All work
          </Link>
          <Reveal>
            <span className="eyebrow">{project.category}</span>
            <h1 className="cs-title">{project.title}</h1>
            <p className="cs-tagline">{project.tagline}</p>
            <div style={{ marginTop: 32 }}>
              <BehanceBtn href={project.behance} primary />
            </div>
          </Reveal>

          <Reveal delay={100}>
            <dl className="cs-meta">
              <div>
                <dt>Role</dt>
                <dd>{project.role}</dd>
              </div>
              <div>
                <dt>Platform</dt>
                <dd>{project.platform}</dd>
              </div>
              <div>
                <dt>Year</dt>
                <dd>{project.year}</dd>
              </div>
              <div>
                <dt>{project.collaborators ? "Team" : "Tools"}</dt>
                <dd>{project.collaborators ? `With ${project.collaborators.join(" & ")}` : project.tools.join(", ")}</dd>
              </div>
            </dl>
          </Reveal>

          <Reveal delay={150} className="cs-cover">
            <ProjectVisual project={project} priority sizes="100vw" tilt />
          </Reveal>
        </div>
      </section>

      <div className="container">
        <div className="cs-content" data-chapter="Story" data-say="Here's the thinking behind it.">
          <Reveal>
            <span className="eyebrow">Overview</span>
          </Reveal>
          <div>
            <Reveal>
              <p className="cs-summary">{project.summary}</p>
            </Reveal>
            {project.facts && (
              <Reveal className="cs-metrics">
                {project.facts.map((m) => (
                  <div key={m.label} className="cs-metric">
                    <strong>{m.value}</strong>
                    <span>{m.label}</span>
                  </div>
                ))}
              </Reveal>
            )}
            <div style={{ marginTop: 56 }}>
              {project.sections?.map((s) => (
                <Reveal key={s.heading} className="cs-section">
                  <h2>{s.heading}</h2>
                  {s.body && <p>{s.body}</p>}
                  {s.bullets && (
                    <ul>
                      {s.bullets.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                  )}
                </Reveal>
              ))}
            </div>
          </div>
        </div>

        {project.gallery && project.gallery.length > 0 && (
          <div className="cs-gallery" data-chapter="Screens" data-say="And here are the screens!">
            {project.gallery.map((src, i) => (
              <Reveal key={src}>
                <Image src={src} alt={`${project.title}: case study image ${i + 1}`} width={1400} height={900} sizes="(max-width: 1240px) 100vw, 1160px" style={{ height: "auto" }} />
              </Reveal>
            ))}
            <Reveal className="cs-be-cta">
              <p>This is a highlight reel. The full case study, with every screen, lives on Behance.</p>
              <BehanceBtn href={project.behance} primary />
            </Reveal>
          </div>
        )}

        <Link href={`/work/${next.slug}`} className="cs-next" data-chapter="Next" data-say="Want to see another one?" data-cursor="Next">
          <span className="eyebrow">Next project</span>
          <div className="cs-next-title">{next.title} →</div>
        </Link>
      </div>
    </article>
  );
}
