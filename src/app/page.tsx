import Link from "next/link";
import Image from "next/image";
import fs from "node:fs";
import path from "node:path";
import Reveal from "@/components/Reveal";
import ProjectVisual from "@/components/ProjectVisual";
import { profile, experience, education, services, skills } from "@/data/profile";
import { featuredProjects, otherProjects } from "@/data/projects";

const Arrow = () => (
  <svg className="arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 17L17 7M8 7h9v9" />
  </svg>
);

const marqueeItems = ["SaaS Products", "Dashboards", "Mobile Apps", "Design Systems", "UX Research", "Enterprise Software", "Prototyping", "Fintech"];

export default function Home() {
  const hasCv = fs.existsSync(path.join(process.cwd(), "public", profile.cv));

  return (
    <>
      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-glow" />
        <div className="container">
          <Reveal>
            <span className="status">
              <span className="pulse" /> {profile.availability}
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="hero-title">
              Product designer making <span className="serif">complex</span> feel simple.
            </h1>
          </Reveal>
          <div className="hero-bottom">
            <Reveal delay={160}>
              <p className="hero-intro">
                Hi, I&apos;m <strong>Godson</strong>. {profile.intro}
              </p>
            </Reveal>
            <Reveal delay={220} className="hero-actions">
              <Link href="#work" className="btn btn-primary">
                View my work <Arrow />
              </Link>
              <a href={`mailto:${profile.email}`} className="btn">
                Get in touch
              </a>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Marquee ── */}
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[...marqueeItems, ...marqueeItems].map((t, i) => (
            <span key={i}>{t}</span>
          ))}
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="container">
        <div className="stats">
          {profile.stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 80} className="stat">
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* ── Featured work ── */}
      <section id="work" className="section">
        <div className="container">
          <div className="section-head">
            <Reveal>
              <span className="eyebrow">Selected work</span>
              <h2 className="h2">
                Case <span className="serif">studies</span>
              </h2>
            </Reveal>
            <Reveal delay={100}>
              <p className="muted" style={{ maxWidth: "36ch", margin: 0 }}>
                A few products I&apos;ve designed end-to-end, from research and flows to polished UI and handoff.
              </p>
            </Reveal>
          </div>

          <div className="work-list">
            {featuredProjects.map((p, i) => (
              <Reveal key={p.slug}>
                <Link href={`/work/${p.slug}`} className="work-card">
                  <ProjectVisual project={p} priority={i === 0} />
                  <div className="work-info">
                    <span className="work-num">
                      {String(i + 1).padStart(2, "0")} / {p.category}
                    </span>
                    <h3 className="work-title">{p.title}</h3>
                    <p className="work-tagline">{p.tagline}</p>
                    <div className="tags">
                      <span className="tag">{p.platform}</span>
                      <span className="tag">{p.year}</span>
                      {p.tools.map((t) => (
                        <span className="tag" key={t}>
                          {t}
                        </span>
                      ))}
                    </div>
                    <span className="work-link">
                      <span className="circle">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                          <path d="M5 12h14M13 6l6 6-6 6" />
                        </svg>
                      </span>
                      Read case study
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="section-head" style={{ marginTop: "clamp(80px, 10vw, 120px)", marginBottom: 0 }}>
              <h3 className="work-title" style={{ margin: 0 }}>
                More <span className="serif">work</span>
              </h3>
              <a href="https://www.behance.net/udochukwu" target="_blank" rel="noreferrer" className="btn">
                Full archive on Behance <Arrow />
              </a>
            </div>
          </Reveal>
          <div className="grid-more">
            {otherProjects.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 4) * 70}>
                <a href={p.behance} target="_blank" rel="noreferrer" className="mini">
                  <ProjectVisual project={p} sizes="(max-width: 960px) 50vw, 25vw" />
                  <h3>{p.title}</h3>
                  <p>{p.tagline}</p>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── About ── */}
      <section id="about" className="section" style={{ paddingTop: 0 }}>
        <div className="container about-grid">
          <Reveal>
            <div className="portrait">
              {profile.portrait ? (
                <Image src={profile.portrait} alt={profile.name} fill sizes="(max-width: 860px) 100vw, 40vw" />
              ) : (
                <span className="portrait-initials">GA</span>
              )}
              <div className="portrait-tag">
                <span>{profile.location}</span>
                <span className="muted">{profile.timezone}</span>
              </div>
            </div>
          </Reveal>
          <div>
            <Reveal>
              <span className="eyebrow">About me</span>
              <p className="about-lead">
                {profile.yearsExperience} years designing products for startups and software teams, with a soft spot for{" "}
                <span className="serif">messy workflows</span> that deserve to be simple.
              </p>
            </Reveal>
            <Reveal delay={100} className="about-body">
              {profile.about.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 28 }}>
                {hasCv && (
                  <a href={profile.cv} className="btn btn-primary" download>
                    Download CV <Arrow />
                  </a>
                )}
                <a href={profile.socials[0].href} target="_blank" rel="noreferrer" className="btn">
                  LinkedIn <Arrow />
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section id="services" className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-head">
            <Reveal>
              <span className="eyebrow">What I do</span>
              <h2 className="h2">
                How I can <span className="serif">help</span>
              </h2>
            </Reveal>
          </div>
          <Reveal className="services">
            {services.map((s, i) => (
              <div className="service" key={s.title}>
                <span className="service-num">0{i + 1}</span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ── Experience ── */}
      <section id="experience" className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-head">
            <Reveal>
              <span className="eyebrow">Experience</span>
              <h2 className="h2">
                Where I&apos;ve <span className="serif">worked</span>
              </h2>
            </Reveal>
          </div>
          <div className="exp-list">
            {experience.map((e, i) => (
              <Reveal key={e.company + e.period} delay={i * 50} className="exp">
                <span className="exp-period">{e.period}</span>
                <div>
                  <h3 className="exp-role">{e.role}</h3>
                  <div className="exp-company">
                    {e.company} · {e.location}
                  </div>
                </div>
                <p className="exp-summary">{e.summary}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Skills & Education ── */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container two-col">
          <div>
            <Reveal>
              <span className="eyebrow">Toolkit</span>
              <h2 className="h2" style={{ marginBottom: 40 }}>
                Skills
              </h2>
            </Reveal>
            {Object.entries(skills).map(([group, items], i) => (
              <Reveal key={group} delay={i * 60} className="skill-group">
                <h3>{group}</h3>
                <div className="chips">
                  {items.map((s) => (
                    <span key={s} className="chip">
                      {s}
                    </span>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
          <div className="edu">
            <Reveal>
              <span className="eyebrow">Learning</span>
              <h2 className="h2" style={{ marginBottom: 40 }}>
                Education
              </h2>
            </Reveal>
            {education.map((e, i) => (
              <Reveal key={e.title} delay={i * 60} className="edu-item">
                <strong>{e.title}</strong>
                <span>
                  {e.org} · {e.date}
                </span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact ── */}
      <section id="contact" className="section" style={{ paddingTop: 0, paddingBottom: 40 }}>
        <div className="container">
          <Reveal className="contact">
            <span className="eyebrow">Contact</span>
            <h2 className="contact-title">Let&apos;s build something people love.</h2>
            <a href={`mailto:${profile.email}`} className="contact-email">
              {profile.email}
            </a>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 36 }}>
              <a href={`mailto:${profile.email}`} className="btn btn-dark">
                Send an email <Arrow />
              </a>
              <a href={`tel:${profile.phoneHref}`} className="btn">
                {profile.phone}
              </a>
            </div>
            <div className="contact-row">
              {profile.socials.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer">
                  {s.label} ↗
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
