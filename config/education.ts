export type EducationItem = {
  school: string;
  degree: string;
  periodShort: string;
  periodLong: string;
  locationShort: string;
  locationLong: string;
  logo: string;
  details?: string[];
  coursework?: string[];
};

export const education: EducationItem[] = [
  {
    school: "University of Georgia",
    degree: "M.S. Computer Science",
    periodShort: "Aug 24 – Dec 26",
    periodLong: "August 2024 – Expected December 2026",
    locationShort: "Athens, GA",
    locationLong: "Athens, Georgia",
    logo: "/assets/uga_logo.png",
    details: [
      "Thesis: Multimodal Self-Supervised Activity Recognition on CASAS Smart-Home Sensor Streams, advised by Dr. Fei Dou.",
      "GPA 3.57 / 4.00.",
      "Research focus: Ambient sensor intelligence, contrastive representation learning, and edge IoT models.",
    ],
    coursework: [
      "Algorithms",
      "Distributed Computing",
      "Database Management",
      "Computer Networks",
      "Machine Learning in IoT",
    ],
  },
  {
    school: "Savitribai Phule Pune University",
    degree: "B.E. Computer Engineering",
    periodShort: "Aug 19 – Jun 23",
    periodLong: "August 2019 – June 2023",
    locationShort: "Pune, IN",
    locationLong: "Pune, India",
    logo: "/assets/sppu_crest.webp",
    details: [
      "Graduated First Class with Distinction · GPA 8.7 / 10.0.",
      "Final Year Project: Resume Ranking System using Machine Learning & NLP (published in IJSREM).",
      "Core foundation in data structures, systems architecture, and distributed systems.",
    ],
    coursework: [
      "Data Structures & Algorithms",
      "Operating Systems",
      "Cloud Computing",
      "Database Systems",
      "High Performance Computing",
      "Machine Learning",
    ],
  },
];
