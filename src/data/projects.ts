// ─────────────────────────────────────────────────────────────
//  Your projects. "featured" projects get a full case study page
//  at /work/<slug>. Others show in the "More work" grid.
//
//  Images: drop files in /public/images/projects/ and set `cover`
//  (and `gallery`) to e.g. "/images/projects/hirepilot-cover.jpg".
//  Until then a styled placeholder is shown.
//
//  Text marked  ✏️  is a draft. Replace it with your real story
//  (problem, what YOU did, results). Real numbers win interviews.
// ─────────────────────────────────────────────────────────────

export type CaseSection = { heading: string; body: string; bullets?: string[] };

export type Project = {
  slug: string;
  title: string;
  tagline: string;
  category: string;
  platform: string;
  year: string;
  role: string;
  tools: string[];
  /** two colours used for the placeholder visual and accents */
  palette: [string, string];
  featured: boolean;
  cover?: string;
  gallery?: string[];
  behance?: string;
  summary: string;
  metrics?: { value: string; label: string }[];
  sections?: CaseSection[];
};

export const projects: Project[] = [
  {
    slug: "hirepilot",
    title: "HirePilot",
    tagline: "A hiring platform that takes the chaos out of recruiting.",
    category: "Product Design · SaaS",
    platform: "Web App",
    year: "2025",
    role: "Product Designer: research, UX, UI, prototyping",
    tools: ["Figma", "FigJam"],
    palette: ["#4F46E5", "#22D3EE"],
    featured: true,
    behance: "https://www.behance.net/udochukwu",
    // ✏️ draft
    summary:
      "HirePilot helps recruiters and hiring teams manage job postings, candidate pipelines and interviews in one place. I designed the end-to-end product experience, from discovery to a high-fidelity, developer-ready design system.",
    sections: [
      {
        heading: "The problem",
        // ✏️ draft
        body: "Hiring teams juggle spreadsheets, inboxes and calendar invites to move candidates forward. Context gets lost between steps, and candidates wait too long to hear back.",
      },
      {
        heading: "My approach",
        // ✏️ draft
        body: "I started by mapping the recruiter journey end-to-end to find where time and information leaked.",
        bullets: [
          "Stakeholder & recruiter interviews to map the real hiring workflow",
          "Competitive analysis of leading ATS tools",
          "Information architecture built around a single candidate pipeline",
          "Low-fi wireframes → interactive prototype → usability testing",
        ],
      },
      {
        heading: "The solution",
        // ✏️ draft
        body: "A pipeline-first dashboard where every candidate, note and interview lives on one board, with clear status, quick actions and scheduling built in.",
      },
      {
        heading: "Outcome",
        // ✏️ add real results/feedback here
        body: "A complete product design and component library handed off to engineering.",
      },
    ],
  },
  {
    slug: "finx",
    title: "FinX Smart Finance",
    tagline: "Personal finance that feels calm, not complicated.",
    category: "Mobile App · Fintech",
    platform: "iOS & Android",
    year: "2025",
    role: "UX/UI Designer",
    tools: ["Figma"],
    palette: ["#10B981", "#0EA5E9"],
    featured: true,
    behance: "https://www.behance.net/udochukwu",
    // ✏️ draft
    summary:
      "FinX is a smart finance app for tracking spending, budgeting and managing money on the go. I designed the mobile UX and UI, focusing on making financial data easy to read at a glance.",
    sections: [
      {
        heading: "The problem",
        body: "Most finance apps overwhelm people with numbers. Users want to know three things fast: what they have, what they spent, and whether they're on track.",
      },
      {
        heading: "My approach",
        bullets: [
          "User research on budgeting habits and pain points",
          "Prioritised a glanceable home screen around balance, spend and goals",
          "Designed onboarding, transactions, budgets and insights flows",
          "Built a reusable mobile component system",
        ],
        body: "I designed for clarity first, so every screen answers one question well.",
      },
      {
        heading: "Outcome",
        body: "A complete mobile app design with a consistent, scalable UI system.",
      },
    ],
  },
  {
    slug: "fitflow",
    title: "FitFlow",
    tagline: "A fitness app and UI kit built to keep people moving.",
    category: "Mobile App · Health",
    platform: "Mobile + UI Kit",
    year: "2024",
    role: "Product Designer: case study & UI kit",
    tools: ["Figma"],
    palette: ["#F97316", "#EF4444"],
    featured: true,
    behance: "https://www.behance.net/udochukwu",
    // ✏️ draft
    summary:
      "FitFlow is a workout and wellness app paired with a full UI kit. The goal was a motivating experience that makes planning, tracking and finishing workouts feel effortless.",
    sections: [
      {
        heading: "The problem",
        body: "People start fitness apps with enthusiasm and drop off within weeks. Plans feel rigid and progress feels invisible.",
      },
      {
        heading: "My approach",
        body: "I focused on momentum: short sessions, visible progress, and friendly feedback.",
        bullets: [
          "Persona and journey mapping for beginner and regular users",
          "Workout builder, tracking and progress flows",
          "A complete UI kit: components, tokens and states",
        ],
      },
      {
        heading: "Outcome",
        body: "A full case study and a reusable UI kit that speeds up future fitness products.",
      },
    ],
  },
  {
    slug: "stream",
    title: "Stream",
    tagline: "Inventory management that businesses can trust.",
    category: "Enterprise · Dashboard",
    platform: "Web App",
    year: "2023",
    role: "Product Designer",
    tools: ["Figma"],
    palette: ["#8B5CF6", "#EC4899"],
    featured: true,
    behance: "https://www.behance.net/udochukwu",
    // ✏️ draft. If this is the Fluttertop project, say so and keep the 30% metric
    summary:
      "Stream is an inventory management system that gives businesses a real-time view of stock, suppliers and orders. I designed the dashboards and core workflows to make dense operational data easy to act on.",
    metrics: [{ value: "30%", label: "Improvement in stock tracking & inventory accuracy" }],
    sections: [
      {
        heading: "The problem",
        body: "Businesses were losing money to stock-outs and miscounts. Data existed, but it was buried in tables nobody wanted to read.",
      },
      {
        heading: "My approach",
        bullets: [
          "Requirements gathering with stakeholders and warehouse users",
          "Information architecture for products, stock, suppliers and orders",
          "Dashboard design that highlights what needs attention",
          "Iterative testing of high-frequency tasks like stock updates",
        ],
        body: "I designed around the actions people take most often, not around the database.",
      },
      {
        heading: "Outcome",
        body: "Clearer stock visibility and faster daily workflows, improving tracking and inventory accuracy by 30%.",
      },
    ],
  },

  // ── More work ──────────────────────────────────────────────
  { slug: "bitsafe-app", title: "BitSafe", tagline: "Crypto wallet app case study", category: "Mobile · Crypto", platform: "Mobile", year: "2023", role: "UI/UX Designer", tools: ["Figma"], palette: ["#F59E0B", "#7C3AED"], featured: false, summary: "", behance: "https://www.behance.net/udochukwu" },
  { slug: "bitsafe-web", title: "BitSafe Website", tagline: "Responsive marketing website", category: "Web · Crypto", platform: "Responsive Web", year: "2023", role: "UI Designer", tools: ["Figma"], palette: ["#7C3AED", "#F59E0B"], featured: false, summary: "", behance: "https://www.behance.net/udochukwu" },
  { slug: "fitness-dashboard", title: "Fitness Dashboard", tagline: "Health metrics at a glance", category: "Dashboard", platform: "Web", year: "2023", role: "UI Designer", tools: ["Figma"], palette: ["#06B6D4", "#22C55E"], featured: false, summary: "", behance: "https://www.behance.net/udochukwu" },
  { slug: "workout-dashboard", title: "Workout Dashboard", tagline: "Training plans & progress", category: "Dashboard", platform: "Web", year: "2023", role: "UI Designer", tools: ["Figma"], palette: ["#EF4444", "#F97316"], featured: false, summary: "", behance: "https://www.behance.net/udochukwu" },
  { slug: "cookmate", title: "CookMate", tagline: "Recipe app landing page", category: "Landing Page", platform: "Web", year: "2022", role: "UI Designer", tools: ["Figma"], palette: ["#84CC16", "#F59E0B"], featured: false, summary: "", behance: "https://www.behance.net/udochukwu" },
  { slug: "hype", title: "Hype", tagline: "Movie trailer app", category: "Mobile · Entertainment", platform: "Mobile", year: "2022", role: "UI Designer", tools: ["Figma"], palette: ["#E11D48", "#6366F1"], featured: false, summary: "", behance: "https://www.behance.net/udochukwu" },
  { slug: "toy-store", title: "Children Toy Store", tagline: "Playful e-commerce website", category: "Web · E-commerce", platform: "Web", year: "2022", role: "UI Designer", tools: ["Figma"], palette: ["#FACC15", "#38BDF8"], featured: false, summary: "", behance: "https://www.behance.net/udochukwu" },
  { slug: "nft-app", title: "NFT Marketplace", tagline: "NFT discovery & trading app", category: "Mobile · Web3", platform: "Mobile", year: "2022", role: "UI Designer", tools: ["Figma"], palette: ["#A855F7", "#14B8A6"], featured: false, summary: "", behance: "https://www.behance.net/udochukwu" },
];

export const featuredProjects = projects.filter((p) => p.featured);
export const otherProjects = projects.filter((p) => !p.featured);
export const getProject = (slug: string) => projects.find((p) => p.slug === slug && p.featured);
