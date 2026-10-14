export interface Certificate {
  title: string;
  issuer: string;
  note?: string;
  credentialUrl?: string;
  badge?: string;
  certificateImage?: string;
  certificateFile?: string;
}

export const certificates: Certificate[] = [
  {
    title: "Manage Kubernetes in Google Cloud",
    issuer: "Google Cloud",
    badge: "/images/certificates/google.png",
    certificateImage: "/images/certificates/previews/google-kubernetes-cert.webp",
    certificateFile: "/images/certificates/docs/google-kubernetes-cert.jpeg",
  },
  {
    title: "Create and Manage Cloud SQL for PostgreSQL Instances",
    issuer: "Google Cloud",
    badge: "/images/certificates/google.png",
    certificateImage: "/images/certificates/previews/google-postgres-cert.webp",
    certificateFile: "/images/certificates/docs/google-postgres-cert.jpeg",
  },
  {
    title: "Kubernetes on AMD Instinct GPUs - From Zero to AI Inference",
    issuer: "AMD AI Academy",
    badge: "/images/certificates/amd.png",
    certificateImage: "/images/certificates/previews/amd-cert.webp",
    certificateFile: "/images/certificates/docs/amd-cert.pdf",
  },
  {
    title: "AI Engineer for Developers Associate",
    issuer: "DataCamp",
    badge: "/images/certificates/datacamp-ai-engineer-associate.webp",
    certificateImage: "/images/certificates/previews/datacamp-ai-engineer-cert.webp",
    certificateFile: "/images/certificates/docs/datacamp-ai-engineer-cert.pdf",
  },
  {
    title: "GitHub Foundations",
    issuer: "GitHub",
    badge: "/images/certificates/github_badge.jpg",
    certificateImage: "/images/certificates/previews/github-foundations-cert.webp",
    certificateFile: "/images/certificates/docs/github-foundations-cert.pdf",
  },
  {
    title: "Databricks Accredited Generative AI Fundamentals",
    issuer: "Databricks Academy",
    badge: "/images/certificates/databricks-generative-ai-fundamentals.webp",
    certificateImage: "/images/certificates/previews/databricks-cert.webp",
    certificateFile: "/images/certificates/docs/databricks-cert.pdf",
  },
  {
    title: "Web Development Fundamentals",
    issuer: "IBM SkillsBuild",
    badge: "/images/certificates/ibm.svg",
    credentialUrl: "https://www.credly.com/badges/e85c2f9f-372b-45b7-ac00-2a1b209e7525",
    certificateImage: "/images/certificates/previews/ibm-web-cert.webp",
    certificateFile: "/images/certificates/docs/ibm-web-cert.pdf",
  },
  {
    title: "Data Fundamentals",
    issuer: "IBM SkillsBuild",
    badge: "/images/certificates/ibm.svg",
    credentialUrl: "https://www.credly.com/badges/6503c29c-a7ea-44bb-be30-b393a467f822",
    certificateImage: "/images/certificates/previews/ibm-data-cert.webp",
    certificateFile: "/images/certificates/docs/ibm-data-cert.pdf",
  },
  {
    title: "Artificial Intelligence Fundamentals",
    issuer: "IBM SkillsBuild",
    badge: "/images/certificates/ibm.svg",
    credentialUrl: "https://www.credly.com/badges/2219930d-3b6e-4cea-8da9-3492d4d7689b",
    certificateImage: "/images/certificates/previews/ibm-ai-cert.webp",
    certificateFile: "/images/certificates/docs/ibm-ai-cert.pdf",
  },
  {
    title: "AI Fluency for Builders",
    issuer: "Claude Academy",
    badge: "/images/certificates/anthropic.webp",
    credentialUrl: "https://academy.claude.com/verify/2e92cb4478ba17886ec4c805a1a7b9d6",
    certificateImage: "/images/certificates/previews/claude-ai-fluency-cert.webp",
    certificateFile: "/images/certificates/docs/claude-ai-fluency-cert.pdf",
  },
  {
    title: "Building with the Claude API",
    issuer: "Claude Academy",
    badge: "/images/certificates/anthropic.webp",
    credentialUrl: "https://academy.claude.com/verify/fd7fb1108afb09b315e6779869269167",
    certificateImage: "/images/certificates/previews/claude-api-cert.webp",
    certificateFile: "/images/certificates/docs/claude-api-cert.pdf",
  },
  {
    title: "Claude 101",
    issuer: "Claude Academy",
    badge: "/images/certificates/claude.webp",
    credentialUrl: "https://academy.claude.com/verify/93f8d20931115872a8eab85c3707e98d",
    certificateImage: "/images/certificates/previews/claude-101-cert.webp",
    certificateFile: "/images/certificates/docs/claude-101-cert.pdf",
  },
  {
    title: "Claude Code 101",
    issuer: "Claude Academy",
    badge: "/images/certificates/claude.webp",
    credentialUrl: "https://academy.claude.com/verify/bcf64653a879d01e52a105e72a63e7e6",
    certificateImage: "/images/certificates/previews/claude-code-101-cert.webp",
    certificateFile: "/images/certificates/docs/claude-code-101-cert.pdf",
  },
  {
    title: "Introduction to Claude Cowork",
    issuer: "Claude Academy",
    badge: "/images/certificates/claude.webp",
    credentialUrl: "https://academy.claude.com/verify/5ff56984ef3b1c23b67727587cf2de04",
    certificateImage: "/images/certificates/previews/claude-cowork-cert.webp",
    certificateFile: "/images/certificates/docs/claude-cowork-cert.pdf",
  },
  {
    title: "AI Foundations",
    issuer: "OpenAI Academy",
    badge: "/images/certificates/openai.webp",
    certificateImage: "/images/certificates/previews/openai-cert.webp",
    certificateFile: "/images/certificates/docs/openai-cert.png",
  },
  {
    title: "AI Skills Passport",
    issuer: "EY and Microsoft",
    badge: "/images/certificates/microsoft.webp",
    certificateImage: "/images/certificates/previews/ey-microsoft-cert.webp",
    certificateFile: "/images/certificates/docs/ey-microsoft-cert.pdf",
  },
];

export interface CertificateGroup {
  issuer: string;
  items: Certificate[];
}

export function groupCertificates(list: Certificate[] = certificates): CertificateGroup[] {
  const groups: CertificateGroup[] = [];
  for (const item of list) {
    const group = groups.find((entry) => entry.issuer === item.issuer);
    if (group) group.items.push(item);
    else groups.push({ issuer: item.issuer, items: [item] });
  }
  return groups;
}
