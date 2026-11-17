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
      <section className="hero" data-chapter="Hello" data-say="Hey, I'm Godson! Let's take a walk.">
        <div className="hero-glow" />
        <div className="hero-grid" aria-hidden="true" />
        <div className="container">
          <span className="status hero-in" style={{ "--d": "0ms" } as React.CSSProperties}>
            <span className="pulse" /> {profile.availability}
          </span>
          <h1 className="hero-title" data-split="">
            Product designer making <span className="serif">complex</span> feel simple.
          </h1>
          <div className="hero-bottom">
            <p className="hero-intro hero-in" style={{ "--d": "500ms" } as React.CSSProperties}>
              Hi, I&apos;m <strong>Godson</strong>. {profile.intro}
            </p>
            <div className="hero-actions hero-in" style={{ "--d": "650ms" } as React.CSSProperties}>
              <Link href="#work" className="btn btn-primary" data-magnetic="">
                View my work <Arrow />
              </Link>
              <a href={`mailto:${profile.email}`} className="btn" data-magnetic="">
                Get in touch
              </a>
            </div>
          </div>
          <div className="scroll-cue hero-in" style={{ "--d": "900ms" } as React.CSSProperties}>
            <span className="scroll-cue-line" />
            Scroll to walk with me
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
              <div className="stat-value" data-count={s.value}>
                {s.value}
              </div>
              <div className="stat-label">{s.label}</div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* ── Featured work ── */}
      <section id="work" className="section" data-chapter="Work" data-say="These are a few products I'm proud of.">
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
                Products I&apos;ve designed end-to-end, from research and flows to polished UI. Every one has a full write-up on Behance.
              </p>
            </Reveal>
          </div>

          <div className="work-list">
            {featuredProjects.map((p, i) => (
              <Reveal key={p.slug}>
                <article className="work-card" data-cursor="Open">
                  <ProjectVisual project={p} priority={i === 0} tilt />
                  <div className="work-info">
                    <span className="work-num">
                      {String(i + 1).padStart(2, "0")} / {p.category}
                    </span>
                    <h3 className="work-title">
                      <Link href={`/work/${p.slug}`} className="stretched">
                        {p.title}
                      </Link>
                    </h3>
                    <p className="work-tagline">{p.tagline}</p>
                    <div className="tags">
                      <span className="tag">{p.platform}</span>
                      <span className="tag">{p.year}</span>
                      {p.tools.slice(0, 2).map((t) => (
                        <span className="tag" key={t}>
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="work-actions">
                      <span className="work-link">
                        <span className="circle">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                            <path d="M5 12h14M13 6l6 6-6 6" />
                          </svg>
                        </span>
                        Case study
                      </span>
                      <a href={p.behance} target="_blank" rel="noreferrer" className="be-link" data-cursor="Behance ↗">
                        <span className="be-mark">Bē</span> View on Behance
                      </a>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="section-head" style={{ marginTop: "clamp(80px, 10vw, 120px)", marginBottom: 0 }}>
              <h3 className="work-title" style={{ margin: 0 }}>
                More <span className="serif">work</span>
              </h3>
              <a href="https://www.behance.net/udochukwu" target="_blank" rel="noreferrer" className="btn" data-magnetic="">
                Full archive on Behance <Arrow />
              </a>
            </div>
          </Reveal>
          <div className="grid-more">
            {otherProjects.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 4) * 70}>
                <a href={p.behance} target="_blank" rel="noreferrer" className="mini" data-cursor="Behance ↗">
                  <ProjectVisual project={p} sizes="(max-width: 960px) 50vw, 25vw" />
                  <h3>{p.title}</h3>
                  <p>
                    {p.tagline} · {p.year}
                  </p>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── About ── */}
      <section id="about" className="section" style={{ paddingTop: 0 }} data-chapter="About" data-say="A little about me.">
        <div className="container about-grid">
          <Reveal>
            <div className="portrait">
              {profile.portrait ? (
                <div className="portrait-orbit">
                  <span className="orbit orbit-1" />
                  <span className="orbit orbit-2" />
                  <Image src={profile.portrait} alt={profile.name} width={276} height={276} className="portrait-photo" />
                  <span className="orbit-chip chip-a">Figma</span>
                  <span className="orbit-chip chip-b">UX Research</span>
                  <span className="orbit-chip chip-c">Design Systems</span>
                </div>
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
                  <a href={profile.cv} className="btn btn-primary" download data-magnetic="">
                    Download CV <Arrow />
                  </a>
                )}
                <a href={profile.socials[0].href} target="_blank" rel="noreferrer" className="btn" data-magnetic="">
                  LinkedIn <Arrow />
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section id="services" className="section" style={{ paddingTop: 0 }} data-chapter="Services" data-say="Here's how I can help your team.">
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
            {services.map((s) => (
              <div className="service" key={s.title}>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ── Experience ── */}
      <section id="experience" className="section" style={{ paddingTop: 0 }} data-chapter="Experience" data-say="The teams I've designed with.">
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
      <section className="section" style={{ paddingTop: 0 }} data-chapter="Toolkit" data-say="My toolkit, and where I learned it.">
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
      <section id="contact" className="section" style={{ paddingTop: 0, paddingBottom: 40 }} data-chapter="Contact" data-say="You made it! Let's build something together." data-wave="">
        <div className="container">
          <Reveal className="contact">
            <span className="eyebrow">Contact</span>
            <h2 className="contact-title">Let&apos;s build something people love.</h2>
            <a href={`mailto:${profile.email}`} className="contact-email">
              {profile.email}
            </a>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 36 }}>
              <a href={`mailto:${profile.email}`} className="btn btn-dark" data-magnetic="">
                Send an email <Arrow />
              </a>
              <a href={`tel:${profile.phoneHref}`} className="btn" data-magnetic="">
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
