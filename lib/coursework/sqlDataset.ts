/**
 * Deterministic SYNTHETIC dataset for the SQL lab. The real job-postings data used for my exercises is not in
 * the repository, so this generator invents data with the same schema. Nothing here describes the real job market.
 * invoices_fact is not in my setup script; its columns are the ones my queries use.
 */
import { mulberry32 } from "./hmm";

export const SCHEMA_SQL = `
CREATE TABLE company_dim (
  company_id INT PRIMARY KEY,
  name TEXT,
  link TEXT,
  link_google TEXT,
  thumbnail TEXT
);
CREATE TABLE skills_dim (
  skill_id INT PRIMARY KEY,
  skills TEXT,
  type TEXT
);
CREATE TABLE job_postings_fact (
  job_id INT PRIMARY KEY,
  company_id INT,
  job_title_short VARCHAR(255),
  job_title TEXT,
  job_location TEXT,
  job_via TEXT,
  job_schedule_type TEXT,
  job_work_from_home BOOLEAN,
  search_location TEXT,
  job_posted_date TIMESTAMP,
  job_no_degree_mention BOOLEAN,
  job_health_insurance BOOLEAN,
  job_country TEXT,
  salary_rate TEXT,
  salary_year_avg NUMERIC,
  salary_hour_avg NUMERIC,
  FOREIGN KEY (company_id) REFERENCES company_dim (company_id)
);
CREATE TABLE skills_job_dim (
  job_id INT,
  skill_id INT,
  PRIMARY KEY (job_id, skill_id),
  FOREIGN KEY (job_id) REFERENCES job_postings_fact (job_id),
  FOREIGN KEY (skill_id) REFERENCES skills_dim (skill_id)
);
CREATE TABLE invoices_fact (
  project_id INT,
  project_company TEXT,
  nerd_role TEXT,
  hours_spent NUMERIC,
  hours_rate NUMERIC
);
`;

const COMPANIES = [
  "Alder Data Co", "Brightpoint Tech", "Cobalt Analytics", "Driftwood Systems", "Evergreen Health Data", "Fjord Software",
  "Granite Cloud", "Harbor Tech Labs", "Ironbridge Finance", "Juniper Insights", "Kestrel Logistics", "Lumen Retail Group",
  "Meridian Tech", "Northgate Labs", "Orchard Media", "Pinecrest Bank", "Quanta Tech Works", "Ridgeline Energy",
  "Saffron Foods Analytics", "Tidewater Insurance", "Umbra Games", "Vantage Learning", "Willow Health", "Xylo Robotics",
  "Yarrow Travel", "Zenith Tech Partners", "Atlas Mobility", "Beacon Public Data", "Cinder Security", "Dune Commerce",
  "Ember Telecom", "Foxglove Pharma", "Glacier Insights", "Hollow Oak Software", "Indigo Streaming", "Jasper Auto",
  "Kite Payments", "Larkspur Education", "Mosaic Data Tech", "Nimbus Weather",
];

const SKILLS: [string, string][] = [
  ["python", "programming"], ["sql", "programming"], ["r", "programming"], ["java", "programming"], ["scala", "programming"],
  ["postgresql", "databases"], ["mysql", "databases"], ["mongodb", "databases"], ["snowflake", "databases"], ["redshift", "databases"],
  ["aws", "cloud"], ["azure", "cloud"], ["gcp", "cloud"], ["pandas", "libraries"], ["numpy", "libraries"],
  ["spark", "libraries"], ["airflow", "libraries"], ["dbt", "libraries"], ["tensorflow", "libraries"], ["scikit-learn", "libraries"],
  ["excel", "analyst_tools"], ["tableau", "analyst_tools"], ["power bi", "analyst_tools"], ["looker", "analyst_tools"], ["sas", "analyst_tools"],
  ["git", "other"], ["docker", "other"], ["kubernetes", "other"], ["linux", "other"], ["jira", "other"],
];

const TITLE_SHORT = ["Data Analyst", "Data Engineer", "Data Scientist", "Business Analyst", "Software Engineer", "Senior Data Analyst", "Senior Data Engineer", "Machine Learning Engineer"];
const TITLE_PREFIX = ["", "", "", "Junior ", "Senior ", "Lead ", "Sr. ", ""];
const TITLE_SUFFIX = ["", "", "", " II", " (Remote)", " - Analytics", ""];
const LOCATIONS = ["Anywhere", "Anywhere", "Atlanta, GA", "Boston, MA", "New York", "Tampa, FL", "Austin, TX", "Seattle, WA", "Chicago, IL", "San Francisco, CA", "Denver, CO"];
const VIA = ["via LinkedIn", "via LinkedIn", "via Indeed", "via Glassdoor", "via ZipRecruiter", "via Company Careers"];
const SCHEDULE = ["Full-time", "Full-time", "Full-time", "Contractor", "Part-time", "Full-time and Contractor"];
const COUNTRIES = ["United States", "United States", "United States", "Canada", "United Kingdom", "India", "Germany"];

const esc = (value: string) => value.replace(/'/g, "''");
const q = (value: string | null) => (value === null ? "NULL" : `'${esc(value)}'`);
const n = (value: number | null) => (value === null ? "NULL" : String(value));
const b = (value: boolean) => (value ? "TRUE" : "FALSE");

export interface DatasetOptions {
  seed?: number;
  postings?: number;
}

/** INSERT statements, in batches, for every table. Referential order is respected. */
export function dataSql({ seed = 2026, postings = 1500 }: DatasetOptions = {}): string[] {
  const rng = mulberry32(seed);
  const pick = <T,>(list: T[]): T => list[Math.floor(rng() * list.length)];
  const statements: string[] = [];

  statements.push(
    `INSERT INTO company_dim VALUES ${COMPANIES.map((name, i) => {
      const slug = name.toLowerCase().replace(/[^a-z]+/g, "-");
      return `(${i + 1}, ${q(name)}, ${q(`https://example.test/${slug}`)}, ${q(`https://example.test/search?q=${slug}`)}, ${q(`https://example.test/logo/${slug}.png`)})`;
    }).join(",")}`,
  );
  statements.push(`INSERT INTO skills_dim VALUES ${SKILLS.map(([skill, type], i) => `(${i + 1}, ${q(skill)}, ${q(type)})`).join(",")}`);

  const jobRows: string[] = [];
  const bridge: string[] = [];
  for (let id = 1; id <= postings; id += 1) {
    const company = 1 + Math.floor(rng() * rng() * COMPANIES.length); // some companies post far more than others
    const short = pick(TITLE_SHORT);
    const base = short.replace("Senior ", "");
    const title = `${pick(TITLE_PREFIX)}${base}${pick(TITLE_SUFFIX)}`.replace("Sr. Senior", "Sr.");
    const location = pick(LOCATIONS);
    const remote = location === "Anywhere";
    const month = 1 + Math.floor(rng() * 12);
    const day = 1 + Math.floor(rng() * 28);
    const hour = Math.floor(rng() * 24);
    const date = `2023-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")} ${String(hour).padStart(2, "0")}:${String(Math.floor(rng() * 60)).padStart(2, "0")}:00`;
    const hasSalary = rng() < 0.4;
    const hourly = hasSalary && rng() < 0.18;
    const baseYear = 62000 + Math.floor(rng() * 110000) + (short.includes("Engineer") || short.includes("Scientist") ? 18000 : 0);
    const yearAvg = hasSalary && !hourly ? Math.round(baseYear / 500) * 500 : null;
    const hourAvg = hourly ? Math.round((20 + rng() * 70) * 100) / 100 : null;
    jobRows.push(
      `(${id}, ${company}, ${q(short)}, ${q(title)}, ${q(location)}, ${q(pick(VIA))}, ${q(pick(SCHEDULE))}, ${b(remote)}, ${q(remote ? "United States" : location)}, ${q(date)}, ${b(rng() < 0.2)}, ${b(rng() < 0.35)}, ${q(pick(COUNTRIES))}, ${q(hourly ? "hour" : yearAvg !== null ? "year" : null)}, ${n(yearAvg)}, ${n(hourAvg)})`,
    );
    const skillCount = 2 + Math.floor(rng() * 5);
    const chosen = new Set<number>();
    while (chosen.size < skillCount) chosen.add(1 + Math.floor(rng() * rng() * SKILLS.length + rng() * 6) % SKILLS.length);
    for (const skill of chosen) bridge.push(`(${id}, ${skill})`);
  }
  for (let i = 0; i < jobRows.length; i += 300) statements.push(`INSERT INTO job_postings_fact VALUES ${jobRows.slice(i, i + 300).join(",")}`);
  for (let i = 0; i < bridge.length; i += 600) statements.push(`INSERT INTO skills_job_dim VALUES ${bridge.slice(i, i + 600).join(",")}`);

  const roles = ["Data Analyst", "Data Engineer", "Data Scientist", "Project Lead"];
  const invoice: string[] = [];
  for (let project = 1; project <= 8; project += 1) {
    const company = pick(COMPANIES);
    for (let line = 0; line < 3 + Math.floor(rng() * 4); line += 1) {
      invoice.push(`(${project}, ${q(company)}, ${q(pick(roles))}, ${Math.round((6 + rng() * 60) * 10) / 10}, ${Math.round(55 + rng() * 80)})`);
    }
  }
  statements.push(`INSERT INTO invoices_fact VALUES ${invoice.join(",")}`);
  return statements;
}

export const TABLES = ["company_dim", "skills_dim", "job_postings_fact", "skills_job_dim", "invoices_fact"] as const;
