export type ProjectCategory =
  | "live-products"
  | "research"
  | "homesense"
  | "featured-work"
  | "hobby"
  | "additional-work";

export type Project = {
  slug: string;
  title: string;
  shortTitle?: string;
  date?: string;
  period?: string;
  category: ProjectCategory;
  categoryLabel: string;
  context?: string;
  contextLabel?: string;
  description: string;
  role?: string;
  tech: string[];
  href?: string; // GitHub repository or default link
  website?: string; // Live product URL
  featured?: boolean;
  cover?: string;
  gradient?: string;
};

export const projectCategories: {
  id: ProjectCategory;
  label: string;
  description: string;
}[] = [
  {
    id: "live-products",
    label: "Live Products",
    description:
      "Production web platforms and commercial products shipped for thousands of active users.",
  },
  {
    id: "research",
    label: "Research",
    description:
      "Machine learning research in smart homes, multimodal fusion, and privacy-preserving learning.",
  },
  {
    id: "homesense",
    label: "HomeSense",
    description:
      "Full-scale smart-home digital-twin intelligence platform built around my M.S. thesis model.",
  },
  {
    id: "featured-work",
    label: "Featured Work",
    description:
      "Interactive learning laboratories, systems simulators, container engines, and performance tools.",
  },
  {
    id: "hobby",
    label: "Hobby",
    description:
      "Sports intelligence, live fight analytics, telemetry models, and real-time watch parties.",
  },
  {
    id: "additional-work",
    label: "Additional Work",
    description:
      "Systems exercises, distributed primitives, database internals, and coursework applications.",
  },
];

export const projects: Project[] = [
  // ==========================================
  // 1. HomeSense
  // ==========================================
  {
    slug: "homesense-platform",
    title: "HomeSense",
    shortTitle: "HomeSense",
    date: "06.2026 - 10.2026",
    period: "June to October 2026",
    category: "homesense",
    categoryLabel: "HomeSense",
    context: "M.S. thesis platform, University of Georgia",
    contextLabel: "Thesis Platform",
    description:
      "Smart-home intelligence platform built around my thesis ML model: live Kafka streaming, anomaly detection with human review, LangGraph assistant, digital-twin floorplan viewer, and Kubernetes deployment.",
    role: "Sole author. Designed and built the ML core library, streaming services, background workers, simulator, anomaly detectors, assistant, and Helm Kubernetes packaging.",
    tech: [
      "Python",
      "FastAPI",
      "Kafka",
      "PostgreSQL",
      "React",
      "PyTorch",
      "Kubernetes",
      "Redis",
      "Helm",
      "MLflow",
    ],
    href: "https://github.com/mrhpsingh01/homesense",
    website: "https://github.com/mrhpsingh01/homesense",
    featured: true,
    cover: "/assets/homesense/twin-viewer.webp",
    gradient: "from-blue-500/25 via-indigo-500/15 to-violet-500/25",
  },

  // ==========================================
  // 2. Live Products
  // ==========================================
  {
    slug: "mainstreet",
    title: "The Mainstreet Marketplace",
    shortTitle: "Mainstreet",
    date: "2023 - 2024",
    period: "2023 to 2024",
    category: "live-products",
    categoryLabel: "Live Products",
    context: "Professional work at Stylabs Technologies",
    contextLabel: "Live Commercial Product",
    description:
      "High-scale sneaker and streetwear e-commerce platform. Developed frontend components, API contracts, and performance optimizations cutting page load times from 4s to 1s.",
    role: "Full-stack contributor. Developed components and API integrations, fixed bugs, and authored comprehensive API documentation improving user engagement by 27%.",
    tech: ["Node.js", "Express", "MongoDB", "REST APIs", "JavaScript"],
    href: "https://marketplace.mainstreet.co.in/",
    website: "https://marketplace.mainstreet.co.in/",
    featured: true,
    cover: "/assets/products/mainstreet.webp",
    gradient: "from-violet-500/20 via-purple-500/15 to-indigo-500/20",
  },
  {
    slug: "profound-properties",
    title: "Profound Properties",
    shortTitle: "Profound Properties",
    date: "2024",
    period: "2024",
    category: "live-products",
    categoryLabel: "Live Products",
    context: "Team project at Stylabs Technologies",
    contextLabel: "Production Web Platform",
    description:
      "Production Dubai real-estate web platform for buying, renting and listing luxury property. Built Next.js frontend components, backend integration with authentication, and AI-assisted data seeding covering 50K records.",
    role: "Full-stack contributor. Set up the project foundation, created reusable components from scratch, and implemented AI data seeding that cut manual curation by 40 hours.",
    tech: [
      "Next.js",
      "React",
      "Node.js",
      "MongoDB",
      "REST APIs",
      "Tailwind CSS",
    ],
    href: "https://www.profoundproperties.com/",
    website: "https://www.profoundproperties.com/",
    featured: true,
    cover: "/assets/products/profound-properties.webp",
    gradient: "from-orange-500/20 via-amber-500/15 to-yellow-500/20",
  },
  {
    slug: "manzil",
    title: "Manzil",
    shortTitle: "Manzil",
    date: "2023 - 2024",
    period: "2023 to 2024",
    category: "live-products",
    categoryLabel: "Live Products",
    context: "Professional work at Stylabs Technologies",
    contextLabel: "Live Rental Product",
    description:
      "A live product for design-led holiday homes and service apartments in Dubai. Built real-time multi-role chat support for guests, staff, and owners, along with rental, sales, and expense modules.",
    role: "Full-stack contributor. Developed the real-time support chat system for customers, employees and owners, and contributed rental, sales and expense features.",
    tech: ["Vue 3", "Node.js", "Express", "MongoDB", "REST APIs"],
    href: "https://www.manzil.life/",
    website: "https://www.manzil.life/",
    featured: true,
    cover: "/assets/products/manzil.webp",
    gradient: "from-amber-500/20 via-orange-500/15 to-rose-500/20",
  },
  {
    slug: "hirevilla",
    title: "Hireavilla",
    shortTitle: "Hireavilla",
    date: "2023 - 2024",
    period: "2023 to 2024",
    category: "live-products",
    categoryLabel: "Live Products",
    context: "Professional work at Stylabs Technologies",
    contextLabel: "Live Rental Marketplace",
    description:
      "Luxury vacation rental marketplace in India. Developed unified multi-role support chat system for guests, property owners, and operations staff, plus core rental and expense modules.",
    role: "Full-stack contributor. Developed support chat and core modules across both customer-facing applications and operations portals.",
    tech: ["Vue 3", "Node.js", "Express", "MongoDB", "REST APIs"],
    href: "https://www.hireavilla.in/",
    website: "https://www.hireavilla.in/",
    featured: true,
    cover: "/assets/products/hirevilla.webp",
    gradient: "from-teal-500/20 via-emerald-500/15 to-green-500/20",
  },

  // ==========================================
  // 3. Research
  // ==========================================
  {
    slug: "smart-home-activity-recognition",
    title: "Human Activity Recognition Research",
    shortTitle: "Human Activity Recognition",
    date: "08.2026",
    period: "August 2026",
    category: "research",
    categoryLabel: "Research",
    context: "M.S. thesis, University of Georgia",
    contextLabel: "M.S. Thesis Research",
    description:
      "Multimodal self-supervised activity recognition research on CASAS smart-home sensor streams. Converts sparse ambient sensor logs into sequence, text summary, floorplan raster, and graph views with fusion transformers and self-supervised pretraining.",
    role: "Thesis author. Built and evaluated the four-view pipeline, multimodal fusion model, replay simulator, and annotation tooling across four CASAS homes.",
    tech: [
      "Python",
      "PyTorch",
      "PyTorch Geometric",
      "Transformers",
      "Graph Neural Networks",
      "CNNs",
    ],
    href: "https://github.com/mrhpsingh01/smart-home-activity-recognition",
    featured: true,
    cover: "/assets/research/sensor-simulator-aruba.webp",
    gradient: "from-emerald-500/25 via-green-500/15 to-lime-500/25",
  },
  {
    slug: "federated-face-recognition-robustness",
    title: "Federated Face Recognition Robustness",
    shortTitle: "Federated Face Recognition",
    date: "2025",
    period: "2025",
    category: "research",
    categoryLabel: "Research",
    context: "Coursework, Machine Learning in IoT (University of Georgia)",
    contextLabel: "Graduate Research Project",
    description:
      "Study of adversarial attack vulnerabilities in smart-home face recognition trained under federated learning. Evaluated FGSM and Square attacks on the FLATS dataset and proposed a hybrid defense combining denoising autoencoders with reverse-attack strategies.",
    role: "Team lead. Coordinated experimental design, adversarial perturbation testing, and evaluation across four team members.",
    tech: [
      "Python",
      "PyTorch",
      "Federated Learning",
      "Denoising Autoencoders",
      "Machine Learning",
    ],
    href: "https://github.com/mrhpsingh01",
    featured: true,
    cover: "/assets/research/flats.png",
    gradient: "from-purple-500/20 via-indigo-500/15 to-blue-500/20",
  },

  // ==========================================
  // 4. Featured Work
  // ==========================================
  {
    slug: "systemforge",
    title: "SystemForge",
    shortTitle: "SystemForge",
    date: "09.2026",
    period: "September 2026",
    category: "featured-work",
    categoryLabel: "Featured Work",
    context: "Independent project",
    contextLabel: "Interactive Learning Tool",
    description:
      "Interactive distributed systems learning lab and simulator featuring 40 system labs, an architecture canvas, failure injection, Raft consensus, and event streaming playgrounds. Helped over 10,000 learners.",
    role: "Designed and built the simulation engine, 40 system labs, canvas, code playground, and Next.js web application.",
    tech: [
      "TypeScript",
      "React 19",
      "Next.js 16",
      "Vitest",
      "Docker",
      "Tailwind CSS",
    ],
    href: "https://github.com/mrhpsingh01/systemforge",
    website: "https://mrhpsingh01.github.io/system_forge/",
    featured: true,
    cover: "/assets/projects/systemforge-playground.webp",
    gradient: "from-sky-500/20 via-cyan-500/15 to-blue-500/20",
  },
  {
    slug: "mlforge",
    title: "MLForge",
    shortTitle: "MLForge",
    date: "09.2026",
    period: "September 2026",
    category: "featured-work",
    categoryLabel: "Featured Work",
    context: "Independent project",
    contextLabel: "Interactive Learning Tool",
    description:
      "Browser-only machine learning workbench with 75 interactive labs and 20 guided projects. Visualizes neural network training, decision boundaries, and loss curves in real-time with from-scratch TypeScript algorithms. Used by 5,000+ users.",
    role: "Designed and implemented the interactive lesson system, all from-scratch ML algorithms in TypeScript, and the Vite client.",
    tech: ["TypeScript", "React 18", "Vite", "KaTeX", "Python"],
    href: "https://github.com/mrhpsingh01/mlforge",
    website: "https://mrhpsingh01.github.io/mlforge/",
    featured: true,
    cover: "/assets/projects/mlforge-neural-network.webp",
    gradient: "from-purple-500/20 via-fuchsia-500/15 to-pink-500/20",
  },
  {
    slug: "mydocker",
    title: "myDocker",
    shortTitle: "myDocker",
    date: "05.2026",
    period: "May 2026",
    category: "featured-work",
    categoryLabel: "Featured Work",
    context: "Independent project",
    contextLabel: "Developer Tool",
    description:
      "Local Docker control plane that automatically discovers compose projects, allocates non-colliding host ports, generates overrides without touching repo files, and streams container logs and builds live in the browser.",
    role: "Designed and built the dashboard, non-colliding port allocator, streaming terminal, and Compose execution layer.",
    tech: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "dockerode",
      "Docker Compose",
      "Vitest",
    ],
    href: "https://github.com/mrhpsingh01/myDocker",
    featured: true,
    cover: "/docs/mydocker/01-overview-docker-active.png",
    gradient: "from-blue-500/20 via-cyan-500/15 to-teal-500/20",
  },
  {
    slug: "querydoctor",
    title: "QueryDoctor",
    shortTitle: "QueryDoctor",
    date: "06.2026",
    period: "June 2026",
    category: "featured-work",
    categoryLabel: "Featured Work",
    context: "Independent project",
    contextLabel: "Developer Tool",
    description:
      "Automated database performance diagnostic engine analyzing PostgreSQL execution plans and MongoDB aggregation pipelines. Tests index candidates with HypoPG and benchmarks promising ones in isolated clones.",
    role: "Designed and built the analysis engine, FastAPI control plane, Celery background workers, and Next.js visual plan viewer.",
    tech: [
      "FastAPI",
      "Celery",
      "PostgreSQL 16",
      "MongoDB 7",
      "Next.js",
      "Docker Compose",
    ],
    href: "https://github.com/mrhpsingh01/query_doctor",
    featured: true,
    cover: "/assets/projects/querydoctor-plan.webp",
    gradient: "from-cyan-500/20 via-teal-500/15 to-emerald-500/20",
  },
  {
    slug: "ml-failure-lab",
    title: "ML Failure Lab",
    shortTitle: "ML Failure Lab",
    date: "2026",
    period: "2026",
    category: "featured-work",
    categoryLabel: "Featured Work",
    context: "Independent project",
    contextLabel: "Model Diagnostics Platform",
    description:
      "Upload classifier predictions to inspect where models fail and why headline metrics deceive: automated failure slices with confidence intervals, cost-aware threshold simulator, and drift monitoring.",
    role: "Designed and built the analysis engine, FastAPI API, Celery background workers, and Next.js frontend with 299 automated tests.",
    tech: [
      "FastAPI",
      "Celery",
      "PostgreSQL",
      "Redis",
      "MinIO",
      "Next.js 16",
      "Python",
      "Docker Compose",
    ],
    href: "https://github.com/mrhpsingh01",
    featured: true,
    cover: "/assets/projects/mlfailurelab-overview.webp",
    gradient: "from-rose-500/20 via-red-500/15 to-orange-500/20",
  },
  {
    slug: "cityops",
    title: "CityOps",
    shortTitle: "CityOps",
    date: "07.2026",
    period: "July 2026",
    category: "featured-work",
    categoryLabel: "Featured Work",
    context: "Independent project",
    contextLabel: "Operations Intelligence",
    description:
      "Municipal operations intelligence dashboard tracking 181,205 NYC 311 requests across boroughs, analyzing resolution times, and evaluating 7-day risk prediction models on chronological holdouts.",
    role: "Built the NYC SODA ingestion pipeline, NestJS GraphQL/REST metric service, Next.js dashboard, and chronological model experiments.",
    tech: [
      "Next.js",
      "NestJS",
      "PostgreSQL",
      "GraphQL",
      "Python",
      "scikit-learn",
      "Playwright",
    ],
    href: "https://github.com/mrhpsingh01/cityops",
    featured: true,
    cover: "/assets/projects/cityops-dashboard.webp",
    gradient: "from-red-500/20 via-rose-500/15 to-pink-500/20",
  },

  // ==========================================
  // 5. Hobby
  // ==========================================
  {
    slug: "f1-race-intelligence",
    title: "F1 Race Intelligence",
    shortTitle: "F1 Race Intelligence",
    date: "2026",
    period: "2026",
    category: "hobby",
    categoryLabel: "Hobby",
    context: "Independent project",
    contextLabel: "Sports Intelligence",
    description:
      "Formula 1 analytics platform providing pre-weekend and post-qualifying podium probability models (calibrated XGBoost & logistic regression) and telemetry duels comparing driver lap traces.",
    role: "Built Jolpica/FastF1 ingestion pipelines, time-safe feature builders, chronological backtests, and FastAPI + Next.js dashboard.",
    tech: [
      "Python",
      "FastAPI",
      "PostgreSQL 16",
      "XGBoost",
      "Parquet",
      "Next.js 14",
      "Recharts",
    ],
    href: "https://github.com/mrhpsingh01/f1_race_intel",
    featured: true,
    gradient: "from-amber-500/20 via-red-500/15 to-yellow-500/20",
  },
  {
    slug: "ufc-fight-intel",
    title: "UFC Fight Intel",
    shortTitle: "UFC Fight Intel",
    date: "2026",
    period: "2026",
    category: "hobby",
    categoryLabel: "Hobby",
    context: "Independent project",
    contextLabel: "Fight Analytics",
    description:
      "Scrapes UFC statistics and trains an interpretable logistic regression model predicting upcoming fight win-probabilities across 17 pre-fight differential features, beating Elo baselines in chronological backtests.",
    role: "Built challenge-solving scraper, MongoDB pipelines, regularized logistic regression, and Next.js public prediction records.",
    tech: [
      "Next.js",
      "TypeScript",
      "MongoDB",
      "Python",
      "scikit-learn",
      "Tailwind CSS 4",
    ],
    href: "https://github.com/mrhpsingh01/ufc_intel",
    featured: true,
    gradient: "from-red-600/20 via-rose-500/15 to-zinc-600/20",
  },
  {
    slug: "ringside",
    title: "Ringside Watch-Party",
    shortTitle: "Ringside",
    date: "08.2026",
    period: "August 2026",
    category: "hobby",
    categoryLabel: "Hobby",
    context: "Independent project",
    contextLabel: "Real-time Platform",
    description:
      "Real-time synchronized sports watch-party platform with spoiler-safe delayed chat, reaction counters, live UFC/F1/cricket rankings, and cross-platform Android mobile app. Used by ~200 users.",
    role: "Built the web application, real-time Socket.IO server with reaction batching, normalized sports API adapters, and Expo mobile app.",
    tech: [
      "React 19",
      "Vite",
      "Express",
      "Socket.IO",
      "Expo",
      "React Native",
      "MongoDB",
    ],
    href: "https://github.com/mrhpsingh01/ringside",
    featured: true,
    cover: "/assets/projects/ringside-discover.webp",
    gradient: "from-lime-500/20 via-green-500/15 to-emerald-500/20",
  },

  // ==========================================
  // 6. Additional Work
  // ==========================================
  {
    slug: "launchhelp",
    title: "LaunchHelp",
    shortTitle: "LaunchHelp",
    date: "2026",
    period: "2026",
    category: "additional-work",
    categoryLabel: "Additional Work",
    context: "Independent project",
    contextLabel: "Product Planning Lab",
    description:
      "Interactive browser-based planning lab guiding product concepts across 13 phases from idea briefs to OpenAPI contracts, test matrices, and launch checklists, paired with a 38-chapter handbook.",
    role: "Designed and built the revision engine, dependency graph, contract generators, markdown/OpenAPI ZIP export, and handbook.",
    tech: ["React 18", "TypeScript", "Vite", "Vitest", "Playwright"],
    href: "https://github.com/mrhpsingh01",
    gradient: "from-blue-500/20 via-sky-500/15 to-cyan-500/20",
  },
  {
    slug: "distributed-key-value-naming-service",
    title: "Distributed Key-Value Naming Service",
    shortTitle: "Key-Value Naming Service",
    date: "2024",
    period: "2024",
    category: "additional-work",
    categoryLabel: "Additional Work",
    context:
      "Coursework, Distributed Computing Systems (University of Georgia)",
    contextLabel: "Distributed Systems",
    description:
      "Java consistent hashing hash-ring service with a bootstrap node and dynamic name servers. Handles dynamic node joins/leaves by reassigning affected key ranges on a 1024-position ring over TCP sockets.",
    role: "Wrote the bootstrap server, dynamic name server range reassignment, and TCP socket command client individually.",
    tech: ["Java", "TCP Sockets", "Consistent Hashing", "Distributed Systems"],
    href: "https://github.com/mrhpsingh01",
    gradient: "from-emerald-500/20 via-teal-500/15 to-cyan-500/20",
  },
  {
    slug: "relational-algebra-query-optimization",
    title: "Relational Algebra & Query Optimization",
    shortTitle: "Relational Algebra Engine",
    date: "2024",
    period: "2024",
    category: "additional-work",
    categoryLabel: "Additional Work",
    context: "Coursework, Database Management Systems (University of Georgia)",
    contextLabel: "Database Systems",
    description:
      "Java relational algebra engine executing select, project, union, minus, and join operators. Optimized with LinHashMap indexing and predicate selectivity-aware query planning.",
    role: "Implemented relational operators from scratch, integrated linear hash index structures, and added predicate-aware planning.",
    tech: ["Java", "Hash Indexing", "Query Optimization", "Database Internals"],
    href: "https://github.com/mrhpsingh01",
    gradient: "from-indigo-500/20 via-blue-500/15 to-sky-500/20",
  },
  {
    slug: "resume-ranking-ml-nlp",
    title: "Resume Ranking with ML and NLP",
    shortTitle: "Resume Ranking System",
    date: "01.2023 - 06.2023",
    period: "January to June 2023",
    category: "additional-work",
    categoryLabel: "Additional Work",
    context: "Undergraduate final-year project, SPPU",
    contextLabel: "Undergraduate Research",
    description:
      "End-to-end resume ranking platform using machine learning and NLP algorithms connected to a Flask API and React interface. Published as a technical paper in IJSRMS (May 2023).",
    role: "Team lead. Built the Flask server, React client, and ML model integration, and co-authored the technical paper.",
    tech: ["Python", "Flask", "React", "NLP", "Machine Learning"],
    href: "https://github.com/mrhpsingh01",
    gradient: "from-violet-500/20 via-purple-500/15 to-pink-500/20",
  },
  {
    slug: "property-management-system",
    title: "Property Management System",
    shortTitle: "Property Management System",
    date: "04.2025",
    period: "April 2025",
    category: "additional-work",
    categoryLabel: "Additional Work",
    context: "Coursework, Database Management Systems (University of Georgia)",
    contextLabel: "Full-Stack Coursework",
    description:
      "Full-stack property management application with PostgreSQL schema, Drizzle ORM, Express API, and Nuxt 3 frontend featuring role-based dashboards for admins, owners, employees, and tenants.",
    role: "Built the Nuxt 3 frontend: authentication flows, role-based dashboards, and CRUD management screens across four user roles.",
    tech: [
      "Nuxt 3",
      "Vue 3",
      "TypeScript",
      "Express",
      "Drizzle ORM",
      "PostgreSQL",
    ],
    href: "https://github.com/mrhpsingh01",
    gradient: "from-teal-500/20 via-cyan-500/15 to-emerald-500/20",
  },
];

export const liveProducts = projects.filter(
  (p) => p.category === "live-products",
);
export const researchProjects = projects.filter(
  (p) => p.category === "research",
);
export const homesenseProjects = projects.filter(
  (p) => p.category === "homesense",
);
export const featuredWorkProjects = projects.filter(
  (p) => p.category === "featured-work",
);
export const hobbyProjects = projects.filter((p) => p.category === "hobby");
export const additionalWorkProjects = projects.filter(
  (p) => p.category === "additional-work",
);

// Backward compatibility helpers
export const latestProjects = projects.filter(
  (p) =>
    p.category === "homesense" ||
    p.category === "featured-work" ||
    p.category === "research",
);
export const professionalProjects = liveProducts;

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
