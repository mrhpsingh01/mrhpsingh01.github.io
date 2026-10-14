export type ExperienceItem = {
  company: string;
  role: string;
  periodShort: string;
  periodLong: string;
  locationShort: string;
  locationLong: string;
  working?: boolean;
  logo?: string;
  website?: string;
  details?: string[];
  tech?: string[];
};

export const experience: ExperienceItem[] = [
  {
    company: "University of Georgia",
    role: "ML/AI Researcher",
    periodShort: "Jun 25 – Dec 26",
    periodLong: "June 2025 – December 2026",
    locationShort: "Athens, GA",
    locationLong: "Athens, Georgia",
    working: true,
    logo: "/assets/uga_logo.png",
    details: [
      "Top results across all five homes. Achieved the highest accuracy and weighted F1 on all five smart homes and the highest macro-F1 on four of five (93.2 Aruba, 86.6 Cairo, 84.1 Kyoto, 93.2 Orange4Home; tied on Milan), as measured against 14 published baselines under one shared protocol averaged over five seeds, by splitting each activity episode into four views and training one lightweight expert per view.",
      "Gains over the strongest published baseline. Raised macro-F1 over the best published baseline on each home by up to 8.7 points (+8.7 Cairo, +4.1 Kyoto, +2.7 Orange, +1.3 Aruba), as measured on identical stratified 60/20/20 splits, by weighting each expert per episode by how often it was right on similar validation episodes.",
      "Efficiency. Beat the strongest multimodal baseline (CARE) by 3.7 to 20.6 macro-F1 points at about one-sixth of its inference cost, as measured by 591 versus 3,631 MFLOPs and 8.2M versus 11.2M parameters, by replacing joint multimodal training with independently trained experts and a parameter-free fusion rule.",
      "No trained fusion network needed. Outperformed four jointly trained fusion designs (Concat+MLP, fusion-token transformer, one-stage SupCon, fine-tuned two-stage alignment) by 1.3 to 2.0 pooled macro-F1 points, and a frozen two-stage alignment by 7.3, by combining frozen experts with local competence weighting, which also lets any expert be swapped without retraining.",
      "Showed where the gain comes from. Demonstrated that the improvement comes from episode-specific weighting, as measured by a net +121 correct predictions (328 errors fixed versus 207 introduced) on the 26.5% of episodes where experts disagree, and 10.3 percentage points more weight on correct experts, by running leave-one-expert-out and per-episode weight diagnostics.",
    ],
    tech: [
      "Python",
      "PyTorch",
      "Machine Learning",
      "Multimodal Fusion",
      "Sensor Intelligence",
    ],
  },
  {
    company: "Stylabs AI Native Studio",
    role: "Full Stack Developer",
    periodShort: "May 23 – Jun 24",
    periodLong: "May 2023 – June 2024",
    locationShort: "Dubai, UAE",
    locationLong: "Dubai, UAE",
    logo: "/assets/stylabs.ico",
    website: "https://www.stylabs.com/",
    details: [
      "Developed more than 50 new frontend components and integrated them with Node.js and Express APIs.",
      "Wrote 70+ API calls and MongoDB aggregate queries for data-heavy screens, and created 100% of API documentation used by frontend and mobile developers.",
      "Developed the chat support system for customers, employees and owners in the Manzil and Hirevilla rental marketplaces.",
      "Tested features, found bugs and fixed them across the client and server.",
      "Built 40+ MongoDB aggregation pipelines over 100K+ user and transaction records, reducing average query latency from 750 ms to 350 ms.",
      "Shipped 35+ production features across 4 web applications serving 500K+ users.",
      "Helped set up the Profound Properties platform: framework choice, template conversion, authentication and data seeding.",
    ],
    tech: [
      "TypeScript",
      "JavaScript",
      "Vue 2/3",
      "React",
      "Next.js",
      "React Native",
      "Tailwind CSS",
      "Node.js",
      "Express",
      "MongoDB",
      "RESTful APIs",
      "Git",
      "Jira",
      "Postman",
      "Swagger",
    ],
  },
  {
    company: "Lykan Technologies",
    role: "Full Stack Developer",
    periodShort: "Jul 21 – Mar 23",
    periodLong: "July 2021 – March 2023",
    locationShort: "Mumbai, IN",
    locationLong: "Mumbai, India",
    logo: "/assets/lykan.svg",
    website: "https://lykan.studio/",
    details: [
      "Reduced average API response times by 35% across high-traffic endpoints by implementing asynchronous request handling in FastAPI and optimizing PostgreSQL query execution plans.",
      "Reduced AWS infrastructure costs by 15% by optimizing Docker container image sizes and tuning Kubernetes resource requests/limits.",
      "Automated deployment pipelines using Git and Docker, reducing deployment cycle times from 50 to 20 minutes while ensuring zero-downtime releases.",
      "Built high-throughput background workers using Python and AWS services to process 10000s records daily with a 99.9% completion rate.",
      "Designed a shared React component library with strict TypeScript interfaces, reducing frontend UI bugs by 25% and accelerating feature delivery across teams.",
    ],
    tech: [
      "Python",
      "TypeScript",
      "FastAPI",
      "PostgreSQL",
      "Redis",
      "RESTful APIs",
      "React",
      "Tailwind CSS",
      "Redux",
      "Docker",
      "Kubernetes",
      "AWS",
      "Git",
      "CI/CD",
      "Prometheus",
      "Grafana",
      "Postman",
    ],
  },
  {
    company: "Freelance",
    role: "Freelance Developer",
    periodShort: "Jan 20 – Jun 21",
    periodLong: "January 2020 – June 2021",
    locationShort: "Remote",
    locationLong: "Remote",
    logo: "/assets/favicon.ico",
    details: [
      "Built web applications and custom websites for local businesses and organizations.",
      "Developed an attendance system for online classes during lockdown to streamline remote attendance tracking.",
      "Built a COVID-19 real-time dashboard for tracking regional pandemic data.",
    ],
    tech: ["React", "JavaScript", "HTML", "CSS", "PHP", "WordPress"],
  },
];
