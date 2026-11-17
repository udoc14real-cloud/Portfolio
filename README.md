# Godson Ani: Portfolio

Personal portfolio site built with **Next.js 16 + React 19 + TypeScript**. No UI libraries, just hand-written CSS.

## Run it locally (VS Code)

1. Install **Node.js 20+** from https://nodejs.org
2. Open this folder in VS Code → **Terminal → New Terminal**
3. Run:

```bash
npm install
npm run dev
```

4. Open http://localhost:3000

## Where to edit things

| What | File |
|---|---|
| Name, bio, email, socials, stats, experience, skills, education, services | `src/data/profile.ts` |
| Projects & case study text | `src/data/projects.ts` |
| Colours, fonts, spacing (theme) | `src/app/globals.css` (top of file) |
| Homepage layout | `src/app/page.tsx` |
| Case study page layout | `src/app/work/[slug]/page.tsx` |

Text marked ✏️ in `projects.ts` is a draft. Replace it with your real story.

## Adding images

- **Your photo:** save as `public/images/portrait.jpg`, then in `profile.ts` set `portrait: "/images/portrait.jpg"`
- **Project covers:** save as e.g. `public/images/projects/hirepilot-cover.jpg`, then add `cover: "/images/projects/hirepilot-cover.jpg"` to that project
- **Case study screens:** add `gallery: ["/images/projects/hirepilot-1.jpg", ...]`
- **CV:** save as `public/Godson-Ani-CV.pdf` and a "Download CV" button appears automatically

## Deploy for free (Vercel)

1. Push this folder to a GitHub repo
2. Go to https://vercel.com → **Add New Project** → import the repo → **Deploy**
3. Update `siteUrl` in `src/app/layout.tsx` to your final domain
