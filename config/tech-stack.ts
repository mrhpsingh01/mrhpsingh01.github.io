export type TechSkill = {
  name: string;
  icon: string;
  color?: string;
};

export type TechCategory = {
  id: string;
  label: string;
  direction: "left" | "right";
  duration: number; // seconds
  skills: TechSkill[];
};

export const techCategories: TechCategory[] = [
  {
    id: "frontend",
    label: "Frontend",
    direction: "left",
    duration: 28,
    skills: [
      { name: "React", icon: "react", color: "#61DAFB" },
      { name: "Next.js", icon: "nextdotjs", color: "#000000" },
      { name: "TypeScript", icon: "typescript", color: "#3178C6" },
      { name: "JavaScript", icon: "javascript", color: "#F7DF1E" },
      { name: "Vue.js", icon: "vuedotjs", color: "#4FC08D" },
      { name: "Tailwind CSS", icon: "tailwindcss", color: "#06B6D4" },
    ],
  },
  {
    id: "backend",
    label: "Backend & Systems",
    direction: "right",
    duration: 36,
    skills: [
      { name: "Python", icon: "python", color: "#3776AB" },
      { name: "FastAPI", icon: "fastapi", color: "#009688" },
      { name: "Node.js", icon: "nodedotjs", color: "#5FA04E" },
      { name: "Express", icon: "express", color: "#000000" },
      { name: "NestJS", icon: "nestjs", color: "#E0234E" },
      { name: "Socket.IO", icon: "socketdotio", color: "#010101" },
      { name: "GraphQL", icon: "graphql", color: "#E10098" },
      { name: "Java", icon: "openjdk", color: "#ED8B00" },
      { name: "C", icon: "c", color: "#A8B9CC" },
      { name: "REST APIs", icon: "fastapi", color: "#2563EB" },
    ],
  },
  {
    id: "ml-ai",
    label: "Machine Learning & AI",
    direction: "left",
    duration: 36,
    skills: [
      { name: "PyTorch", icon: "pytorch", color: "#EE4C2C" },
      { name: "LLMs", icon: "huggingface", color: "#FFD21E" },
      { name: "RAG", icon: "langchain", color: "#1C3C3C" },
      { name: "Transformers", icon: "huggingface", color: "#FFD21E" },
      { name: "CNNs", icon: "tensorflow", color: "#FF6F00" },
      { name: "Scikit-learn", icon: "scikitlearn", color: "#F7931E" },
      { name: "LightGBM", icon: "python", color: "#22C55E" },
      { name: "Ollama", icon: "ollama", color: "#000000" },
      { name: "Pandas", icon: "pandas", color: "#150458" },
      { name: "NumPy", icon: "numpy", color: "#013243" },
    ],
  },
  {
    id: "databases-devops",
    label: "Databases, DevOps & Tools",
    direction: "right",
    duration: 38,
    skills: [
      { name: "PostgreSQL", icon: "postgresql", color: "#4169E1" },
      { name: "MongoDB", icon: "mongodb", color: "#47A248" },
      { name: "Redis", icon: "redis", color: "#DC382D" },
      { name: "Docker", icon: "docker", color: "#2496ED" },
      { name: "Kubernetes", icon: "kubernetes", color: "#326CE5" },
      { name: "Linux", icon: "linux", color: "#FCC624" },
      { name: "Git", icon: "git", color: "#F05032" },
      { name: "GitHub", icon: "github", color: "#181717" },
      { name: "Jira", icon: "jira", color: "#0052CC" },
      { name: "Playwright", icon: "vitest", color: "#2EAD33" },
      { name: "Postman", icon: "postman", color: "#FF6C37" },
      { name: "MinIO", icon: "minio", color: "#C72C48" },
    ],
  },
];
