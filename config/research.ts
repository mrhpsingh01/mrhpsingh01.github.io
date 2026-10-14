export const thesisData = {
  title: "Multimodal Self-Supervised Activity Recognition on CASAS Smart-Home Sensor Streams",
  shortTitle: "Reading smart-home sensors four ways",
  degree: "M.S. in Computer Science",
  school: "University of Georgia",
  year: "2026",
  advisor: "Dr. Fei Dou",
  pdf: {
    href: "/thesis/Harmanpreet-Singh-MS-Thesis.pdf",
    pages: 58,
    size: "2.3 MB",
    label: "Download Thesis (PDF)",
  },
  lede: "A smart home can recognise what a resident is doing without cameras, just from ambient motion and door sensors clicking on and off. My thesis investigates how best to read those sparse event logs, finding that the optimal representation depends directly on the home's topology.",
  facts: [
    { value: "4", label: "CASAS Homes", note: "Aruba, Cairo, Kyoto and Milan" },
    { value: "4", label: "Synchronized Views", note: "Sequence, text, raster image & graph" },
    { value: "30", label: "Events Per Window", note: "Stride of 15 with balanced overlap" },
    { value: "3", label: "Random Seeds", note: "Evaluated across seeds 10, 30 and 50" },
  ],
  views: [
    {
      name: "Sequence",
      badge: "Transformer",
      description: "Ordered sensor timestamps, states, cyclic time-of-day, and inter-event intervals.",
    },
    {
      name: "Text Summary",
      badge: "NLP Encoder",
      description: "Deterministic natural language narrative summarizing room visits and movement pace.",
    },
    {
      name: "Raster Image",
      badge: "CNN",
      description: "96x96 spatial activation heatmap projected directly onto the home floor plan.",
    },
    {
      name: "Graph Network",
      badge: "GNN",
      description: "Spatial-temporal event and sensor topology with local message passing and global attention.",
    },
  ],
  results: [
    {
      house: "Aruba",
      best: "Graph + Image + Sequence",
      weightedF1: "0.850",
      macroF1: "0.735",
      baseline: "SICA (0.847)",
    },
    {
      house: "Cairo",
      best: "Graph + Text + Image",
      weightedF1: "0.842",
      macroF1: "0.524",
      baseline: "SICA (0.755)",
    },
    {
      house: "Kyoto",
      best: "Image + Text + Sequence",
      weightedF1: "0.843",
      macroF1: "0.766",
      baseline: "SICA (0.821)",
    },
  ],
};

export const paperData = {
  name: "FACET",
  title:
    "FACET: Factorized Ambient-Sensor Experts with Local Competence-Weighted Fusion for Smart-Home Activity Recognition",
  status: "Submitted to IEEE PerCom 2027",
  venue: "IEEE PerCom 2027",
  reviewStatus: "Under review at IEEE PerCom 2027",
  credit: "Joint research in Fei Dou's research lab at the University of Georgia.",
  lede: "A machine learning paper on recognizing daily human activities from ambient smart-home sensors using factorized expert models and local competence-weighted fusion.",
  linkText: "View Paper Overview",
};

export interface WritingEntry {
  title: string;
  venue: string;
  kind: string;
  note: string;
  href?: string;
}

export const writing: WritingEntry[] = [
  {
    title: "Multimodal Self-Supervised Activity Recognition on CASAS Smart-Home Sensor Streams",
    venue: "M.S. thesis, University of Georgia",
    kind: "Thesis",
    note: "Four derived views of sensor windows, evaluated on four CASAS houses.",
    href: "/projects/smart-home-activity-recognition",
  },
  {
    title:
      "FACET: Factorized Ambient-Sensor Experts with Local Competence-Weighted Fusion for Smart-Home Activity Recognition",
    venue: "Conference paper, submitted and under review (joint work)",
    kind: "Paper under review",
    note: "Not yet accepted or published.",
    href: "/research",
  },
  {
    title: "Survey on Contrastive Self-Supervised Learning in Human Activity Recognition",
    venue: "Graduate research seminar, University of Georgia",
    kind: "Survey",
    note: "Sole-authored, ACM-style survey of contrastive approaches (SimCLR, CPC, multi-sensor fusion, time-frequency contrast) and open problems such as false-negative handling and augmentation design.",
  },
  {
    title: "Resume Ranking System Using Machine Learning & NLP",
    venue:
      "International Journal of Scientific Research in Engineering and Management (IJSREM), Vol. 07, Issue 05, May 2023",
    kind: "Technical paper",
    note: "Written with the undergraduate project team.",
  },
];
