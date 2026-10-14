import { heroConfig } from "@/config/hero";

export const aboutConfig = {
  headline: ["From systems and full-stack code", "to applied machine learning."],
  intro:
    "I'm Harmanpreet Singh — a **software engineer** and **graduate researcher** at the University of Georgia. I build production web applications, machine learning pipelines, and distributed backend systems with a focus on reliability, clear abstractions, and observable metrics.",
  quote:
    "Good engineering is about measured tradeoffs: clean interfaces, observable systems, and software that actually ships.",
  traits: ["Full-Stack", "Applied ML", "Systems", "Builder"] as const,
  traitStyles: {
    "Full-Stack":
      "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800/80 dark:bg-sky-950/40 dark:text-sky-300",
    "Applied ML":
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800/80 dark:bg-emerald-950/40 dark:text-emerald-300",
    Systems:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800/80 dark:bg-amber-950/40 dark:text-amber-300",
    Builder:
      "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-800/80 dark:bg-violet-950/40 dark:text-violet-300",
  },
  meta: [
    { label: "Location", value: heroConfig.location },
    { label: "Status", value: "Open to opportunities" },
    { label: "Focus", value: "Full-Stack · Applied ML · Systems" },
  ],
  story: {
    title: "My background",
    paragraphs: [
      "I am a software engineer and researcher focused on the intersection of full-stack systems, distributed architectures, and applied machine learning. I believe the best software balances rigorous evaluation, clear abstractions, and end-to-end craftsmanship — whether that means shaving 400 milliseconds off a high-volume database query or training specialized AI models that run with zero inference bloat.",
      "My engineering career started in Computer Engineering at Savitribai Phule Pune University, diving deep into operating systems, compilers, networks, and algorithms. In industry, I built and scaled systems for high-stakes environments: at Lykan Technologies, I optimized FastAPI backends, engineered background workers handling 10,000+ daily records, and tuned Kubernetes deployments on AWS. At Stylabs AI Native Studio, I built full-stack applications serving over 500,000 users across commercial marketplaces like Manzil and Hireavilla, architected real-time WebSocket chat engines, and built 40+ MongoDB aggregation pipelines that cut query latency by 53%.",
      "To deepen my theoretical and systems work, I joined the University of Georgia for my Master of Science in Computer Science, advised by Dr. Fei Dou. My research tackles ambient sensor intelligence and multimodal self-supervised learning on CASAS smart homes — recognizing daily human activities without invasive cameras or microphones. By factorizing sparse sensor windows into sequence, narrative text, floorplan raster, and graph views with local competence-weighted fusion, our work achieved the highest accuracy across all 5 testbed homes and beat the strongest multimodal baselines at one-sixth of the computational cost (submitted to IEEE PerCom 2027).",
      "I don't leave research in Jupyter notebooks. To bring my thesis model into the real world, I engineered HomeSense — an end-to-end digital-twin platform streaming live sensor telemetry through Apache Kafka, orchestrating automated anomaly detection with human review, embedding a LangGraph assistant, and deploying everything onto Kubernetes with Helm. Alongside that, I love building developer-first educational tools: from SystemForge (a distributed systems simulation lab used by 10,000+ learners) to MLForge (an in-browser ML laboratory implementing neural networks from scratch in TypeScript).",
    ],
  },
  principles: {
    title: "How I work",
    items: [
      {
        title: "Evaluation is part of design",
        description:
          "Benchmark realistic workloads against stratified splits and multiple seeds before making claims or architectural bets.",
      },
      {
        title: "Measure before optimizing",
        description:
          "Profile real production query plans and bottlenecks first — like dropping MongoDB aggregation latency from 750 ms to 350 ms.",
      },
      {
        title: "End-to-end ownership",
        description:
          "From Kafka streaming pipelines and database schemas to reactive interfaces, digital twins, and Kubernetes Helm deployments.",
      },
      {
        title: "Inspect the raw data",
        description:
          "Before trusting an aggregate score, build visualizers to inspect raw event streams, coordinate rasters, and boundary cases directly.",
      },
      {
        title: "Write clear contracts",
        description:
          "Self-documenting APIs, strict TypeScript schemas, and thorough documentation ensure teams ship fast in parallel.",
      },
      {
        title: "Ship with observability",
        description:
          "Instrument systems with structured logging, health checks, anomaly review queues, and latency metrics from commit zero.",
      },
    ],
  },
  beyond: {
    title: "Beyond the code",
    paragraphs: [
      "When I'm not writing code or training models, I enjoy reading technical papers, analyzing Formula 1 telemetry traces and combat sports data, exploring new open-source systems, and experimenting with distributed primitives.",
      "I value engineering teams that care about craft, high agency, open collaboration, and building software people genuinely rely on.",
    ],
  },
  connectLinks: [
    {
      name: "Email",
      href: "mailto:harmansinghuga@gmail.com",
      icon: "mail" as const,
    },
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/in/harmanuga/",
      icon: "linkedin" as const,
    },
    {
      name: "GitHub",
      href: "https://github.com/mrhpsingh01",
      icon: "github" as const,
    },
  ],
};
