export type Achievement = {
  slug: string;
  title: string;
  organization: string;
  year: string;
  periodShort: string;
  periodLong: string;
  details?: string[];
  image?: string;
  gallery?: string[];
  featured?: boolean;
};

export const achievements: Achievement[] = [
  {
    slug: "google-cloud-kubernetes",
    title: "Manage Kubernetes in Google Cloud",
    organization: "Google Cloud",
    year: "2024",
    periodShort: "2024",
    periodLong: "Google Cloud Certified Badge",
    details: [
      "Configured and managed production Kubernetes clusters in Google Cloud.",
      "Set up containerized deployments, autoscaling, ingress controllers, and persistent storage.",
    ],
    image: "/images/certificates/google-manage-kubernetes.webp",
    featured: true,
  },
  {
    slug: "google-cloud-sql-postgres",
    title: "Cloud SQL for PostgreSQL",
    organization: "Google Cloud",
    year: "2024",
    periodShort: "2024",
    periodLong: "Google Cloud Certified Badge",
    details: [
      "Created, configured, and tuned high-availability PostgreSQL instances on Google Cloud SQL.",
      "Managed connection pooling, automatic failover, backups, and database indexing strategies.",
    ],
    image: "/images/certificates/google-cloud-sql-postgresql.webp",
    featured: true,
  },
  {
    slug: "datacamp-ai-engineer",
    title: "AI Engineer for Developers Associate",
    organization: "DataCamp",
    year: "2024",
    periodShort: "2024",
    periodLong: "DataCamp Verified Credential",
    details: [
      "Practical mastery in deploying LLMs, vector search, RAG pipelines, and model evaluation.",
      "Covered prompt engineering, embeddings, and API integration for production applications.",
    ],
    image: "/images/certificates/datacamp-ai-engineer-associate.webp",
    featured: true,
  },
  {
    slug: "databricks-generative-ai",
    title: "Generative AI Fundamentals",
    organization: "Databricks Academy",
    year: "2024",
    periodShort: "2024",
    periodLong: "Databricks Accredited",
    details: [
      "Accredited in fundamental generative AI architectures, fine-tuning methodologies, and enterprise deployment.",
    ],
    image: "/images/certificates/databricks-generative-ai-fundamentals.webp",
    featured: true,
  },
  {
    slug: "ibm-ai-fundamentals",
    title: "Artificial Intelligence Fundamentals",
    organization: "IBM SkillsBuild",
    year: "2023",
    periodShort: "2023",
    periodLong: "IBM SkillsBuild Credential",
    details: [
      "Verified on Credly: AI architectures, supervised and unsupervised learning, and ethics in AI systems.",
    ],
    image: "/images/certificates/ibm-artificial-intelligence-fundamentals.webp",
    featured: true,
  },
  {
    slug: "claude-ai-fluency",
    title: "AI Fluency for Builders",
    organization: "Claude Academy",
    year: "2024",
    periodShort: "2024",
    periodLong: "Claude Academy Verified",
    details: [
      "Building robust AI agents, tool-calling pipelines, structured workflows, and prompt engineering.",
    ],
    image: "/images/certificates/claude-ai-fluency-for-builders.webp",
    featured: true,
  },
];

export function getAchievement(slug: string) {
  return achievements.find((item) => item.slug === slug);
}
