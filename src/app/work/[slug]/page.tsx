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

export default async function CaseStudy({ params }: { params: Params }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const idx = featuredProjects.findIndex((p) => p.slug === slug);
  const next = featuredProjects[(idx + 1) % featuredProjects.length];

  return (
    <article>
      <section className="cs-hero">
        <div className="container">
          <Link href="/#work" className="back">
            ← All work
          </Link>
          <Reveal>
            <span className="eyebrow">{project.category}</span>
            <h1 className="cs-title">{project.title}</h1>
            <p className="cs-tagline">{project.tagline}</p>
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
                <dt>Tools</dt>
                <dd>{project.tools.join(", ")}</dd>
              </div>
            </dl>
          </Reveal>

          <Reveal delay={150} className="cs-cover">
            <ProjectVisual project={project} priority sizes="100vw" />
          </Reveal>
        </div>
      </section>

      <div className="container">
        <div className="cs-content">
          <Reveal>
            <span className="eyebrow">Overview</span>
          </Reveal>
          <div>
            <Reveal>
              <p className="cs-summary">{project.summary}</p>
            </Reveal>
            {project.metrics && (
              <Reveal className="cs-metrics">
                {project.metrics.map((m) => (
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
                  <p>{s.body}</p>
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
            {project.behance && (
              <Reveal>
                <a href={project.behance} target="_blank" rel="noreferrer" className="btn" style={{ marginTop: 24 }}>
                  See full project on Behance ↗
                </a>
              </Reveal>
            )}
          </div>
        </div>

        {project.gallery && project.gallery.length > 0 && (
          <div className="cs-gallery" style={{ paddingBottom: 100 }}>
            {project.gallery.map((src, i) => (
              <Reveal key={src}>
                <Image src={src} alt={`${project.title} screen ${i + 1}`} width={2400} height={1600} sizes="100vw" />
              </Reveal>
            ))}
          </div>
        )}

        <Link href={`/work/${next.slug}`} className="cs-next">
          <span className="eyebrow">Next project</span>
          <div className="cs-next-title">{next.title} →</div>
        </Link>
      </div>
    </article>
  );
}
