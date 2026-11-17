// ─────────────────────────────────────────────────────────────
//  Your projects. Content is taken from your Behance case studies.
//  "featured" projects get a case study page at /work/<slug>
//  that ends with a link to the full project on Behance.
//  Everything else links straight to Behance.
//
//  Images live in /public/images/projects/
// ─────────────────────────────────────────────────────────────

export type CaseSection = { heading: string; body?: string; bullets?: string[] };

export type Project = {
  slug: string;
  title: string;
  tagline: string;
  category: string;
  platform: string;
  year: string;
  role: string;
  tools: string[];
  /** two colours used for accents and fallbacks */
  palette: [string, string];
  featured: boolean;
  cover: string;
  gallery?: string[];
  behance: string;
  collaborators?: string[];
  summary?: string;
  facts?: { value: string; label: string }[];
  sections?: CaseSection[];
};

const img = (f: string) => `/images/projects/${f}`;
const be = (path: string) => `https://www.behance.net/gallery/${path}`;

export const projects: Project[] = [
  {
    slug: "hirepilot",
    title: "HirePilot",
    tagline: "AI-powered recruitment operations for enterprise hiring teams.",
    category: "Product Design · SaaS · AI",
    platform: "Desktop Web App (MVP)",
    year: "2026",
    role: "Product Designer",
    tools: ["Figma", "Photoshop"],
    palette: ["#3E97FF", "#7239EA"],
    featured: true,
    cover: img("hirepilot-cover.jpg"),
    gallery: [1, 2, 3, 4, 5, 6].map((n) => img(`hirepilot-${n}.jpg`)),
    behance: be("250036321/HirePilot-Product-Design-Case-Study"),
    collaborators: ["Alexander Akinbiyi"],
    summary:
      "HirePilot is an AI-powered recruitment operations platform for enterprise HR teams and staffing agencies. It brings job roles, candidate management, AI-powered matching and recruiter communication into one scalable system. It's a desktop-first MVP focused on cutting manual recruitment effort while improving hiring speed, visibility and candidate-to-role matching.",
    facts: [
      { value: "5", label: "Product goals defined" },
      { value: "4", label: "User groups designed for" },
      { value: "Job-first", label: "Workflow model with AI matching" },
    ],
    sections: [
      {
        heading: "The problem",
        body: "Recruitment teams work across fragmented tools, so it's hard to manage candidates, track roles and keep hiring efficient.",
        bullets: [
          "Heavy manual effort screening and shortlisting candidates",
          "Slow alignment between job requirements and candidate profiles",
          "No unified recruitment database",
          "Inefficient recruiter–candidate communication",
          "Difficulty finding the most suitable candidates at scale",
        ],
      },
      {
        heading: "Who it's for",
        body: "Enterprise HR departments, staffing agencies and technical recruiters, with hiring managers as secondary users. Our persona, a senior technical recruiter, switches between spreadsheets, email, ATS tools and chat all day, and reviewing large volumes of CVs slows every decision down.",
      },
      {
        heading: "The strategy",
        body: "Instead of recruiters searching for candidates manually, they define the job first and the system matches candidates automatically.",
        bullets: [
          "Recruiter creates a job role and requirements are structured",
          "AI scans the candidate database and ranks the best fits",
          "Recruiter reviews recommendations",
          "The system generates outreach emails and follow-ups",
        ],
      },
      {
        heading: "Process",
        body: "Empathise → Research → Ideate → Design. We mapped the information architecture (dashboard, candidates, projects, job matches, emails, scripts and notifications), moved through low-fidelity wireframes and finished with a high-fidelity UI and a style guide built on Inter.",
      },
      {
        heading: "Outcome",
        body: "HirePilot shows how recruitment operations can be simplified through structured design and controlled AI integration.",
        bullets: [
          "Clearer recruitment workflows",
          "Less dependence on manual screening",
          "Faster candidate-to-role matching",
          "Better visibility across hiring pipelines",
          "Streamlined recruiter communication",
        ],
      },
    ],
  },
  {
    slug: "finx",
    title: "FinX Smart Finance",
    tagline: "A fintech app that puts people in control of their money.",
    category: "Mobile App · Fintech",
    platform: "iOS & Android",
    year: "2023",
    role: "Product Designer: interviews, analytics, UX/UI, design system",
    tools: ["Figma", "Adobe XD", "Photoshop", "Illustrator"],
    palette: ["#0A2A5C", "#FFC300"],
    featured: true,
    cover: img("finx-cover.jpg"),
    gallery: [1, 2, 3, 4, 5, 6, 7].map((n) => img(`finx-${n}.jpg`)),
    behance: be("181716697/FinX-Smart-Finance-Mobile-App-UXUI-Design"),
    collaborators: ["Chiamaka Azuh", "Andrew Ijeh"],
    summary:
      "FinX is a fintech app that gives people smart money-management tools, educational resources and insights so they can take control of their financial wellbeing. It brings budgeting, cards, payments and financial education together in one user-centred experience.",
    facts: [
      { value: "90+", label: "Screens designed" },
      { value: "2 wks", label: "Project duration" },
      { value: "Light + Dark", label: "Full theme support" },
    ],
    sections: [
      {
        heading: "The problem",
        body: "People struggle to manage their finances with fragmented tools and little guidance. They needed a single, user-centred app that simplifies money management, improves financial literacy and builds long-term wellbeing.",
      },
      {
        heading: "Research",
        body: "We ran problem-discovery interviews with 5 respondents, and they confirmed all three of our hypotheses. People want simplicity and ease of use, personalised insights, and educational content inside the app.",
        bullets: [
          "Three persona segments: Gen Z & millennials, adults in their prime earning years, and investors & savvy users",
          "Competitive analysis of Mint, Robinhood and Acorns",
          "Key insights: demand for simplicity, personalisation, education, security & privacy, and mobile accessibility",
        ],
      },
      {
        heading: "Design",
        body: "Journey maps for tasks like adding a new card shaped the user flows from account setup to payments, history, cards and profile. We then built a design system (Josefin Sans, a navy-and-gold palette, inputs, cards and iconography) and designed 90+ screens in both light and dark mode.",
      },
    ],
  },
  {
    slug: "fitflow",
    title: "FitFlow",
    tagline: "Find your flow, embrace your fit.",
    category: "Mobile App · Health & Fitness",
    platform: "Mobile App + UI Kit",
    year: "2023",
    role: "Product Designer: UX/UI, interviews, branding",
    tools: ["Figma", "Adobe XD", "Photoshop"],
    palette: ["#FF3B3B", "#FF8A65"],
    featured: true,
    cover: img("fitflow-cover.jpg"),
    gallery: [1, 2, 3, 4, 5, 6].map((n) => img(`fitflow-${n}.jpg`)),
    behance: be("177578789/FitFlow-App-Full-Case-Study-and-UI-Kit"),
    collaborators: ["Andrew Ijeh", "Chiamaka Azuh"],
    summary:
      "FitFlow is a personalised fitness companion for individuals and fitness coaches. It offers tailored workout routines for every level, progress tracking and a supportive community, and it ships with a full UI kit.",
    facts: [
      { value: "5", label: "Interview respondents" },
      { value: "2", label: "Audience segments: individuals & coaches" },
      { value: "UI Kit", label: "Shipped with the case study" },
    ],
    sections: [
      {
        heading: "Goals",
        bullets: [
          "Personalised workout routines for all levels",
          "Progress tracking and achievements",
          "Cardio, strength, flexibility, HIIT and yoga routines",
          "A supportive community for motivation",
          "Customisable workout plans in a user-friendly interface",
        ],
      },
      {
        heading: "Research",
        body: "Competitive analysis of Fitbit, Nike Training Club and MyFitnessPal, plus problem-discovery interviews with 5 respondents, confirmed our hypotheses. Users prefer personalised plans, social features boost engagement, and a self-competition score keeps people coming back.",
      },
      {
        heading: "Unique features",
        bullets: [
          "FlowScore: a personal fitness metric that encourages self-competition",
          "Curated workout music playlists",
          "Real-time sessions with certified instructors",
          "AI-driven workout recommendations",
          "Challenges with rewards",
        ],
      },
      {
        heading: "Design",
        body: "Journey maps, user flows and an app structure led into wireframes and high-fidelity mockups covering onboarding, discovery, workout views, insights and profile, all backed by a Montserrat-based style guide and iconography set.",
      },
    ],
  },
  {
    slug: "stream",
    title: "Stream",
    tagline: "An all-in-one business app for inventory, accounting and marketing.",
    category: "Mobile App · Business",
    platform: "Mobile App",
    year: "2022",
    role: "UI/UX Designer",
    tools: ["Figma", "Adobe XD", "Photoshop", "Illustrator"],
    palette: ["#FF0000", "#F27272"],
    featured: true,
    cover: img("stream-cover.jpg"),
    gallery: [1, 2, 3, 4].map((n) => img(`stream-${n}.jpg`)),
    behance: be("154399137/Stream-Inventory-Management-System"),
    summary:
      "Stream is an all-in-one business solution for inventory management, accounting and marketing. Think of it as a cloud-based inventory system that brings back-office and financial services together on a single dashboard.",
    sections: [
      {
        heading: "What I designed",
        bullets: [
          "Product and items-used tracking with daily summaries",
          "Adding products and the items they use",
          "Business and user profiles with team management",
          "Onboarding: sign up, Google sign-in and account creation",
        ],
      },
      {
        heading: "Process",
        body: "I started with low-fidelity wireframes of the core flows, then moved to high-fidelity mockups with a bold red system built on Plus Jakarta Sans and Inter.",
      },
    ],
  },

  // ── More work (links straight to Behance) ───────────────────
  { slug: "bitsafe-app", title: "BitSafe", tagline: "Crypto wallet app case study", category: "Mobile · Crypto", platform: "Mobile", year: "2023", role: "UI/UX Designer", tools: ["Figma"], palette: ["#F59E0B", "#7C3AED"], featured: false, cover: img("bitsafe-app-cover.jpg"), behance: be("165680413/BitSafe-Crypto-App-Case-Study") },
  { slug: "bitsafe-web", title: "BitSafe Website", tagline: "Responsive website design", category: "Web · Crypto", platform: "Responsive Web", year: "2023", role: "UI Designer", tools: ["Figma"], palette: ["#7C3AED", "#F59E0B"], featured: false, cover: img("bitsafe-web-cover.jpg"), behance: be("165901281/BitSafe-Responsive-Website-Design") },
  { slug: "fitness-dashboard", title: "Fitness Dashboard", tagline: "Health metrics at a glance", category: "Dashboard", platform: "Web", year: "2023", role: "UI Designer", tools: ["Figma"], palette: ["#06B6D4", "#22C55E"], featured: false, cover: img("fitness-dashboard-cover.jpg"), behance: be("169576021/Fitness-Dashboard") },
  { slug: "workout-dashboard", title: "Workout Dashboard", tagline: "Training plans & progress", category: "Dashboard", platform: "Web", year: "2023", role: "UI Designer", tools: ["Figma"], palette: ["#EF4444", "#F97316"], featured: false, cover: img("workout-dashboard-cover.jpg"), behance: be("169576585/Workout-Dashboard") },
  { slug: "cookmate", title: "CookMate", tagline: "Recipe app landing page", category: "Landing Page", platform: "Web", year: "2023", role: "UI Designer", tools: ["Figma"], palette: ["#84CC16", "#F59E0B"], featured: false, cover: img("cookmate-cover.jpg"), behance: be("164395611/CookMate-Landing-Page") },
  { slug: "hype", title: "Hype", tagline: "Movie trailer app", category: "Mobile · Entertainment", platform: "Mobile", year: "2022", role: "UI Designer", tools: ["Figma"], palette: ["#E11D48", "#6366F1"], featured: false, cover: img("hype-cover.jpg"), behance: be("155024159/Hype-Movie-Trailer-App") },
  { slug: "toy-store", title: "Children Toy Store", tagline: "Playful e-commerce website", category: "Web · E-commerce", platform: "Web", year: "2023", role: "UI Designer", tools: ["Figma"], palette: ["#FACC15", "#38BDF8"], featured: false, cover: img("toy-store-cover.jpg"), behance: be("169478667/Children-Toy-Website") },
  { slug: "nft-app", title: "NFT App", tagline: "NFT discovery & trading app", category: "Mobile · Web3", platform: "Mobile", year: "2023", role: "UI Designer", tools: ["Figma"], palette: ["#A855F7", "#14B8A6"], featured: false, cover: img("nft-app-cover.jpg"), behance: be("174409353/NFT-app-Design") },
];

export const featuredProjects = projects.filter((p) => p.featured);
export const otherProjects = projects.filter((p) => !p.featured);
export const getProject = (slug: string) => projects.find((p) => p.slug === slug && p.featured);
