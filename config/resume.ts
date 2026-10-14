export const resumeConfig = {
  title: "Resume",
  description: "Software engineering, applied machine learning, and distributed systems experience.",
  fileId: "resume-pdf",
  viewUrl: "/assets/resume.pdf",
  embedUrl: "/assets/resume.pdf",
  downloadUrl: "/assets/resume.pdf",
};

export const resumeSummary =
  "Software engineer and ML/AI researcher with production full-stack experience from Stylabs AI Native Studio and Lykan Technologies, and graduate research in machine learning, multimodal sensor intelligence, and distributed systems at the University of Georgia. Developed the FACET framework achieving state-of-the-art activity recognition across 5 CASAS smart homes at 1/6th the inference cost of prior multimodal baselines. Built HomeSense, an end-to-end event-streaming and digital-twin platform orchestrating Kafka, FastAPI, React, and Kubernetes around the thesis architecture.";

export const resumeSkills: { group: string; items: string[] }[] = [
  { group: "Languages", items: ["Python", "TypeScript", "JavaScript", "SQL", "C", "C++", "Java", "PHP", "HTML/CSS"] },
  {
    group: "Machine learning",
    items: [
      "PyTorch",
      "PyTorch Geometric",
      "Multimodal Fusion",
      "Self-Supervised & Contrastive Learning",
      "Transformers",
      "Graph Neural Networks (GNNs)",
      "CNNs",
      "scikit-learn",
      "NumPy",
      "pandas",
      "matplotlib",
      "MLflow",
      "LangChain",
      "LangGraph",
      "RAG",
    ],
  },
  {
    group: "Backend and data",
    items: [
      "FastAPI",
      "Node.js",
      "Express",
      "Flask",
      "RESTful APIs",
      "Kafka",
      "PostgreSQL",
      "MongoDB",
      "Redis",
      "MySQL",
      "Socket.IO",
      "Drizzle ORM",
    ],
  },
  {
    group: "Cloud and DevOps",
    items: [
      "Docker",
      "Kubernetes (EKS)",
      "Helm",
      "AWS (S3, EC2, RDS)",
      "GitHub Actions (CI/CD)",
      "Prometheus",
      "Grafana",
      "Linux / Bash",
    ],
  },
  {
    group: "Frontend",
    items: [
      "React",
      "Next.js",
      "React Native (Expo)",
      "Vue 2/3",
      "Nuxt.js",
      "Vite",
      "Tailwind CSS",
      "Redux",
      "KaTeX",
    ],
  },
  {
    group: "Systems and networking",
    items: [
      "TCP & UDP sockets",
      "Threads & Locks",
      "Distributed KV stores",
      "Consistent hashing",
      "Discrete-event simulation",
      "DNS & HTTP range requests",
      "OpenSSL",
    ],
  },
  {
    group: "Testing and tools",
    items: ["Git", "Postman", "Swagger", "Vitest", "Playwright", "Jira", "Linux"],
  },
];

/** The project shown first and in full on the resume page. */
export const resumeHighlightSlug = "homesense-platform";

/** Selected projects: the one project shown first and in full. */
export const resumeSelectedSlugs = ["homesense-platform"];

/** Work projects: the commercial platforms built at Stylabs Technologies. */
export const resumeWorkSlugs = ["profound-properties", "manzil", "hirevilla", "mainstreet"];

/** Additional independent and systems projects. */
export const resumeMoreSlugs = [
  "mydocker",
  "ringside",
  "mlforge",
  "systemforge",
  "federated-face-recognition-robustness",
  "relational-algebra-query-optimization",
  "distributed-key-value-naming-service",
  "resume-ranking-ml-nlp",
];
