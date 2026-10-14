/**
 * The SQL exercises from my practice repository, exactly as written (statement from the comment
 * at the top of each file, query below it). Review notes and corrected or adapted queries were
 * added for the lab. Generated from the .sql files by private/gen_sql.py.
 */

export interface SqlExercise {
  id: string;
  file: string;
  topic: string;
  title: string;
  statement: string;
  /** The query as I wrote it. */
  sql: string;
  /** A review note when the original does not answer its problem or does not run on PostgreSQL. */
  note?: string;
  /** A corrected query, when the original gives a wrong answer. */
  fixed?: string;
  /** The same query adapted to run on PostgreSQL, when the original errors. */
  adapted?: string;
}

export const sqlTopics = ["Selecting and ordering", "Filtering", "Aliases and arithmetic", "Aggregation", "Joins", "Dates and times", "Creating tables", "CASE expressions", "Subqueries and CTEs"] as const;

export const sqlExercises: SqlExercise[] = [
  {
    "id": "basic1",
    "file": "basic1.sql",
    "topic": "Selecting and ordering",
    "statement": "Get the unique (distinct) job locations in the job_postings_fact table. Order in alphabetical order (ascending order).",
    "sql": "SELECT DISTINCT job_location\nFROM job_postings_fact\nORDER BY job_location",
    "title": "Distinct job locations"
  },
  {
    "id": "basic2",
    "file": "basic2.sql",
    "topic": "Selecting and ordering",
    "statement": "In the job_postings_fact table get the columns job_id, job_title_short, job_location and job_via columns. And order it in ascending order by job_location.",
    "sql": "SELECT \n  job_id,\n    job_title_short,\n    job_location,\n    job_via\nFROM job_postings_fact\nORDER BY job_location",
    "title": "Selected columns ordered by location"
  },
  {
    "id": "basic3",
    "file": "basic3.sql",
    "topic": "Selecting and ordering",
    "statement": "In the job_postings_fact table get the columns job_id, job_title_short, job_location job_via, and salary_year_avg columns. And only look at rows where job_title_short is 'Data Engineer'",
    "sql": "SELECT \n  job_id,\n    job_title_short,\n    job_location,\n    job_via,\n    salary_year_avg\nFROM job_postings_fact\nWHERE \n  job_title_short = 'Data Engineer'",
    "title": "Data Engineer postings"
  },
  {
    "id": "comparision1",
    "file": "comparision1.sql",
    "topic": "Filtering",
    "statement": "In the job_postings_fact table get the job_id, job_title_short, job_location, job_via, and salary_year_avg columns. Only return rows where the job location is in 'Tampa, FL'",
    "sql": "SELECT\n  job_id,\n    job_title_short,\n    job_location,\n    job_via,\n    salary_year_avg\nFROM job_postings_fact\nWHERE\n  job_location = 'Tampa, FL'",
    "title": "Postings in Tampa, FL"
  },
  {
    "id": "comparision2",
    "file": "comparision2.sql",
    "topic": "Filtering",
    "statement": "In the job_postings_fact table get the job_id, job_title_short, job_location, job_via, and salary_year_avg columns. Only return 'Full-Time' jobs.",
    "sql": "SELECT \n  job_id,\n    job_title_short,\n    job_location,\n    job_via,\n    salary_year_avg\nFROM job_postings_fact\nWHERE\n  job_schedule_type = 'Full-time'",
    "title": "Full-time postings"
  },
  {
    "id": "comparision3",
    "file": "comparision3.sql",
    "topic": "Filtering",
    "statement": "In the job_postings_fact table get the job_id, job_title_short, job_location, job_via, and salary_year_avg columns. Only look at jobs that are not 'Part-time' jobs (hint: look at the job_schedule_type column).",
    "sql": "SELECT \n  job_id,\n    job_title_short,\n    job_location,\n    job_via,\n    salary_year_avg,\nFROM job_postings_fact\nWHERE \n  job_schedule_type <> 'Part-time'",
    "note": "A trailing comma after the last selected column is a syntax error in PostgreSQL. The adapted query removes it. Note also that <> 'Part-time' drops postings whose schedule type is NULL.",
    "adapted": "SELECT\n  job_id,\n  job_title_short,\n  job_location,\n  job_via,\n  salary_year_avg\nFROM job_postings_fact\nWHERE\n  job_schedule_type <> 'Part-time'",
    "title": "Everything except part-time"
  },
  {
    "id": "comparision4",
    "file": "comparision4.sql",
    "topic": "Filtering",
    "statement": "In the job_postings_fact table only get jobs that have an average yearly salary of $65,000 or greater. Also get the job_id, job_title_short, job_location, job_via, and salary_year_avg columns. Order the results by salary_year_avg in ascending order.",
    "sql": "SELECT \n  job_id,\n    job_title_short,\n    job_location,\n    job_via,\n    salary_year_avg\nFROM job_postings_fact\nWHERE\n  salary_year_avg >= 65000\nORDER BY\n  salary_year_avg",
    "title": "Salary of at least $65,000"
  },
  {
    "id": "comparision5",
    "file": "comparision5.sql",
    "topic": "Filtering",
    "statement": "In the job_postings_fact table get the job_id, job_title_short, job_location, job_via, and salary_year_avg columns. Only look at jobs that are not posted 'via LinkedIn'",
    "sql": "SELECT \n  job_id,\n    job_title_short,\n    job_location,\n    job_via,\n    salary_year_avg\nFROM job_postings_fact\nWHERE NOT\n  job_via = 'via LinkedIn'",
    "title": "Not posted via LinkedIn"
  },
  {
    "id": "comparision6",
    "file": "comparision6.sql",
    "topic": "Filtering",
    "statement": "In the job_postings_fact table only get jobs that have an average yearly salary greater than $55,000. Also get the job_id, job_title_short, job_location, job_via, and salary_year_avg columns. Order the results by salary_year_avg in ascending order.",
    "sql": "SELECT \n  job_id,\n    job_title_short,\n    job_location,\n    job_via,\n    salary_year_avg\nFROM job_postings_fact\nWHERE\n  salary_year_avg > 55000\nORDER BY\n  salary_year_avg",
    "title": "Salary over $55,000, ascending"
  },
  {
    "id": "comparision7",
    "file": "comparision7.sql",
    "topic": "Filtering",
    "statement": "In the job_postings_fact table only get jobs that have an average yearly salary less than $110000. Also return the job_id, job_title_short, job_location, job_via, and salary_year_avg columns. Order the results by salary_year_avg in descending order.",
    "sql": "SELECT \n  job_id,\n    job_title_short,\n    job_location,\n    job_via,\n    salary_year_avg\nFROM job_postings_fact\nWHERE\n  salary_year_avg < 110000\nORDER BY\n  salary_year_avg DESC",
    "title": "Salary under $110,000, descending"
  },
  {
    "id": "wildcards1",
    "file": "wildcards1.sql",
    "topic": "Filtering",
    "statement": "In the company_dim table find all company names that include 'Tech' immediately followed by any single character. Return the name column.",
    "sql": "SELECT *\nFROM \n  company_dim\nWHERE \n  name LIKE '%Tech%'",
    "note": "The problem asks for 'Tech' immediately followed by one character. '%Tech%' matches any name containing Tech. '%Tech_%' needs at least one character after it.",
    "fixed": "SELECT *\nFROM\n  company_dim\nWHERE\n  name LIKE '%Tech_%'",
    "title": "Company names containing Tech"
  },
  {
    "id": "wildcards2",
    "file": "wildcards2.sql",
    "topic": "Filtering",
    "statement": "Find all job postings in the job_postings_fact where the job_title is exactly \"Engineer\" and one character followed after the term. Get the job_id, job_title, and job_posted_date.",
    "sql": "SELECT \n  job_id,\n  job_title,\n    job_posted_date\nFROM \n  job_postings_fact\nWHERE \n  job_title LIKE '%Engineer_'",
    "title": "Titles ending in Engineer plus one character"
  },
  {
    "id": "null",
    "file": "null.sql",
    "topic": "Filtering",
    "statement": "Identify all job postings that have neither an annual average salary (salary_year_avg) nor an hourly average salary (salary_hour_avg) in the job_postings_fact table. Return the job_id, job_title, salary_year_avg, salary_hour_avg This can be useful to look at postings where there's no compensation.",
    "sql": "SELECT \n  job_id,\n  job_title,\n    salary_year_avg,\n    salary_hour_avg\nFROM \n  job_postings_fact\nWHERE \n  salary_year_avg IS NOT NULL\n  OR\n    salary_hour_avg IS NOT NULL",
    "note": "The problem asks for postings with neither salary. My query returns the opposite: postings with at least one. The fix is IS NULL joined with AND.",
    "fixed": "SELECT\n  job_id,\n  job_title,\n  salary_year_avg,\n  salary_hour_avg\nFROM\n  job_postings_fact\nWHERE\n  salary_year_avg IS NULL\n  AND\n  salary_hour_avg IS NULL",
    "title": "Postings with no salary at all"
  },
  {
    "id": "problem1",
    "file": "problem1.sql",
    "topic": "Filtering",
    "statement": "Get job details for BOTH 'Data Analyst' or 'Business Analyst' positions - For 'Data Analyst,' I want jobs only > $100k - For 'Business Analyst,' I only want jobs > $70K Only include jobs located in EITHER: - 'Boston, MA' O 'Anywhere' (i.e., Remote jobs)",
    "sql": "SELECT *\nFROM job_postings_fact\nWHERE\n  job_location IN ('Boston, MA', 'Anywhere') AND\n    (\n    (job_title_short = 'Data Analyst' AND salary_year_avg > 100000) OR\n      (job_title_short = 'Business Analyst' AND salary_year_avg > 70000)\n    )\nORDER BY\n  job_title_short",
    "title": "Analyst roles above a salary threshold"
  },
  {
    "id": "problem2",
    "file": "problem2.sql",
    "topic": "Filtering",
    "statement": "Look for non-senior data analyst or business analyst roles Get the job title, location, and average yearly salary",
    "sql": "SELECT \n  job_title,\n  job_location AS location,\n    salary_year_avg AS average_yearly_salary\nFROM \n  job_postings_fact\nWHERE\n     (\n       job_title LIKE '%Data%' OR\n       job_title LIKE '%Business%'\n     ) AND \n       job_title LIKE '%Analyst%' AND \n         job_title NOT LIKE '%Senior%' AND\n        job_title NOT LIKE '%SR%'\nORDER BY\n  job_title",
    "title": "Non-senior data or business analyst roles"
  },
  {
    "id": "alias",
    "file": "alias.sql",
    "topic": "Aliases and arithmetic",
    "statement": "From the job_postings_fact return the following columns: job_id, job_title_short job_location, job_via, job_posted_date, and salary_year_avg . Also, rename the following: job_via to job_posted_site and salary_year_avg to avg_yearly_salary.",
    "sql": "SELECT \n  job_id,\n  job_title_short,\n    job_location,\n    job_via AS job_posted_site,\n    salary_year_avg avg_yearly_salary\nFROM \n  job_postings_fact",
    "title": "Renaming columns"
  },
  {
    "id": "arithematic",
    "file": "arithematic.sql",
    "topic": "Aliases and arithmetic",
    "statement": "In the invoices_fact table multiply the hours_spent to the hours_rate. This could be used to prioritize tasks, higher values could indicate tasks that are both time-intensive and costly, therefore requiring early attention.",
    "sql": "SELECT \n  project_id,\n    project_company,\n    nerd_role,\n    hours_spent * hours_rate AS project_cost\nFROM invoices_fact\nORDER BY project_cost DESC",
    "title": "Project cost from hours and rate"
  },
  {
    "id": "problem3",
    "file": "problem3.sql",
    "topic": "Aliases and arithmetic",
    "statement": "- Calculates the total earnings per project - Calculate a scenario where the hourly rate increases by $5",
    "sql": "SELECT \n  project_id,\n    SUM(hours_spent) * AVG(hours_rate) as earnings,\n    SUM(hours_spent) * ( AVG(hours_rate) + 5 ) as earnings_after_hike\nFROM \n  invoices_fact\nGROUP BY \n  project_id",
    "note": "SUM(hours) times AVG(rate) is only right when every invoice line has the same rate. Summing hours times rate per line is exact.",
    "fixed": "SELECT\n  project_id,\n  SUM(hours_spent * hours_rate) AS earnings,\n  SUM(hours_spent * (hours_rate + 5)) AS earnings_after_hike\nFROM\n  invoices_fact\nGROUP BY\n  project_id",
    "title": "Earnings per project and after a raise"
  },
  {
    "id": "aggregation1",
    "file": "aggregation1.sql",
    "topic": "Aggregation",
    "statement": "In the job_postings_fact table count the total number of job postings that offer health insurance. Use the job_health_insurance column to determine if a job posting offers health insurance (1 means it does offer health insurance).",
    "sql": "SELECT \n  COUNT(job_health_insurance) as total_health_insurance\nFROM job_postings_fact\nWHERE \n  job_health_insurance = 1",
    "note": "Written with 1 for true. PostgreSQL has a real boolean type and rejects boolean = 1, so the original errors here. The adapted query uses TRUE.",
    "adapted": "SELECT\n  COUNT(job_health_insurance) AS total_health_insurance\nFROM job_postings_fact\nWHERE\n  job_health_insurance = TRUE",
    "title": "Postings that offer health insurance"
  },
  {
    "id": "aggregation2",
    "file": "aggregation2.sql",
    "topic": "Aggregation",
    "statement": "In the job_postings_fact table count the number of job postings available for each country. Use the job_country column to group the job postings, and count the number of job postings (job_id ) within each country group.",
    "sql": "SELECT \n  job_country,\n  COUNT(job_id) AS total_count\nFROM job_postings_fact\nGROUP BY job_country",
    "title": "Postings per country"
  },
  {
    "id": "aggregation3",
    "file": "aggregation3.sql",
    "topic": "Aggregation",
    "statement": "In the job_postings_fact table calculate the total sum of the average yearly salary ( salary_year_avg ) for all job postings that are marked as fully remote ( job_work_from_home is 1) and divide it by the total count of salary_year_avg. To get the total average yearly salary for fully remote jobs. Ensure to only include job postings where a yearly salary is specified (include salary_year_avg is not NULL).",
    "sql": "SELECT \n  SUM(salary_year_avg) / COUNT(salary_year_avg) as avg_salary\nFROM job_postings_fact\nWHERE \n  salary_year_avg IS NOT NULL AND\n  job_work_from_home = 1",
    "note": "Same boolean-versus-integer problem. AVG(salary_year_avg) would be the shorter way to write the same thing.",
    "adapted": "SELECT\n  SUM(salary_year_avg) / COUNT(salary_year_avg) AS avg_salary\nFROM job_postings_fact\nWHERE\n  salary_year_avg IS NOT NULL AND\n  job_work_from_home = TRUE",
    "title": "Average salary of remote jobs"
  },
  {
    "id": "join1",
    "file": "join1.sql",
    "topic": "Joins",
    "statement": "Retrieve the list of job titles ( job_title) and the corresponding company names ( name ) for all job postings that mention \"Data Scientist\" in the job title. Use the job_postings_fact and company_dim tables for this query.",
    "sql": "SELECT \n  postings.job_title,\n  companies.name AS company_name\nFROM \n  job_postings_fact AS postings\nLEFT JOIN company_dim AS companies ON postings.company_id = companies.company_id",
    "title": "Data Scientist postings with company names"
  },
  {
    "id": "join2",
    "file": "join2.sql",
    "topic": "Joins",
    "statement": "Fetch all job postings, including their job titles ( job_title) and the names of the skills required ( skills), even if no skills are listed for a job. Ensure that the job is located in \"New York\" and offers \"Health Insurance\". Use the job_postings_fact, skills_job_dim, and skills_dim tables.",
    "sql": "SELECT\n  postings.job_title,\n    skills.skills\nFROM \n  job_postings_fact AS postings\nLEFT JOIN skills_job_dim AS skill_to_job ON postings.job_id = skill_to_job.job_id\nLEFT JOIN skills_dim AS skills ON skill_to_job.skill_id = skills.skill_id \nWHERE\n  postings.job_location = 'New York'\n  AND\n  postings.job_health_insurance = 1",
    "note": "Boolean compared with 1 again. The adapted query uses TRUE.",
    "adapted": "SELECT\n  postings.job_title,\n  skills.skills\nFROM\n  job_postings_fact AS postings\nLEFT JOIN skills_job_dim AS skill_to_job ON postings.job_id = skill_to_job.job_id\nLEFT JOIN skills_dim AS skills ON skill_to_job.skill_id = skills.skill_id\nWHERE\n  postings.job_location = 'New York'\n  AND\n  postings.job_health_insurance = TRUE",
    "title": "New York postings with their skills"
  },
  {
    "id": "problem5",
    "file": "problem5.sql",
    "topic": "Joins",
    "statement": "Find the average salary and number of job postings for each skill for this:",
    "sql": "SELECT \n  skills.skills AS skill_name,\n    AVG(postings.salary_year_avg) as average_salary,\n  COUNT(postings.job_id) as number_of_postings\nFROM \n  job_postings_fact as postings\nLEFT JOIN \n  skills_job_dim AS skill_to_job \n      ON postings.job_id = skill_to_job.job_id\nLEFT JOIN \n  skills_dim AS skills \n      ON skill_to_job.skill_id = skills.skill_id\nGROUP BY\n  skills.skills",
    "title": "Average salary and posting count per skill"
  },
  {
    "id": "problem6",
    "file": "problem6.sql",
    "topic": "Dates and times",
    "statement": "Problem 6: Count of Data Analyst Job Postings by Month Write a SQL query to count the number of job postings for the job title 'Data Analyst' for each month. The result should include the month and the corresponding count of job postings, ordered by month in ascending order. Limit the results to the first 12 months.",
    "sql": "SELECT \n    COUNT(job_id),\n    EXTRACT(MONTH FROM job_posted_date) AS month\nFROM job_postings_fact\nWHERE job_title_short = 'Data Analyst'\nGROUP BY month\nLIMIT 12;",
    "note": "The problem asks for results ordered by month. Without ORDER BY the row order is not guaranteed, and LIMIT 12 could then keep arbitrary months.",
    "fixed": "SELECT\n  EXTRACT(MONTH FROM job_posted_date) AS month,\n  COUNT(job_id) AS postings\nFROM job_postings_fact\nWHERE job_title_short = 'Data Analyst'\nGROUP BY month\nORDER BY month\nLIMIT 12",
    "title": "Data Analyst postings by month"
  },
  {
    "id": "problem7",
    "file": "problem7.sql",
    "topic": "Dates and times",
    "statement": "Write a query to find the average salary both yearly (salary_year_avg)and hourly (salary_hour_avg ) for job postings that were posted after June 1, 2023. Group the results by job schedule type.",
    "sql": "SELECT \n    COUNT(job_id) AS num_of_postings,\n    AVG(salary_year_avg) AS avg_yearly_salary,\n    AVG(salary_hour_avg) AS avg_hourly_salary,\n    job_schedule_type\nFROM \n    job_postings_fact\nWHERE \n    job_posted_date::DATE > '2023-06-01'::DATE AND\n    (salary_hour_avg IS NOT NULL OR\n    salary_year_avg IS NOT NULL)\nGROUP BY \n    job_schedule_type\nORDER BY\n    num_of_postings DESC;",
    "title": "Salaries by schedule type after June 2023"
  },
  {
    "id": "problem8",
    "file": "problem8.sql",
    "topic": "Dates and times",
    "statement": "Write a query to count the number of job postings for each month in 2023, adjusting the job_posted_date to be in 'America/New_York' time zone before extracting the month. Assume the job_posted_date is stored in UTC. Group by and order by the month.",
    "sql": "SELECT \n    COUNT(job_id) AS num_of_jobs,\n    EXTRACT(MONTH FROM job_posted_date AT TIME ZONE 'UTC' AT TIME ZONE 'EST') AS job_posted_month\nFROM \n    job_postings_fact\nGROUP BY\n    job_posted_month\nORDER BY\n    job_posted_month;",
    "note": "Two gaps: 'EST' is a fixed offset with no daylight saving, while the problem names America/New_York, and there is no filter for 2023.",
    "fixed": "SELECT\n  COUNT(job_id) AS num_of_jobs,\n  EXTRACT(MONTH FROM job_posted_date AT TIME ZONE 'UTC' AT TIME ZONE 'America/New_York') AS job_posted_month\nFROM\n  job_postings_fact\nWHERE\n  EXTRACT(YEAR FROM job_posted_date AT TIME ZONE 'UTC' AT TIME ZONE 'America/New_York') = 2023\nGROUP BY\n  job_posted_month\nORDER BY\n  job_posted_month",
    "title": "Postings per month in New York time"
  },
  {
    "id": "problem9",
    "file": "problem9.sql",
    "topic": "Dates and times",
    "statement": "Write a query to find companies (include company name) that have posted jobs offering health insurance, where these postings were made in the second quarter of 2023. Use date extraction to filter by quarter.",
    "sql": "SELECT \n    companies.name AS company,\n    postings.job_posted_date,\n    postings.job_health_insurance\nFROM \n    job_postings_fact AS postings\nLEFT JOIN company_dim AS companies ON postings.company_id = companies.company_id\nWHERE \n    EXTRACT(MONTH FROM postings.job_posted_date) > 3 AND\n    EXTRACT(MONTH FROM postings.job_posted_date) < 7 AND\n    job_health_insurance = TRUE \nLIMIT 1000;",
    "note": "The month filter does mean Q2, but it ignores the year. EXTRACT(QUARTER ...) says what is meant more directly.",
    "fixed": "SELECT\n  companies.name AS company,\n  postings.job_posted_date,\n  postings.job_health_insurance\nFROM\n  job_postings_fact AS postings\nLEFT JOIN company_dim AS companies ON postings.company_id = companies.company_id\nWHERE\n  EXTRACT(QUARTER FROM postings.job_posted_date) = 2 AND\n  EXTRACT(YEAR FROM postings.job_posted_date) = 2023 AND\n  postings.job_health_insurance = TRUE\nLIMIT 1000",
    "title": "Companies offering health insurance in Q2"
  },
  {
    "id": "problem10",
    "file": "problem10.sql",
    "topic": "Creating tables",
    "statement": "Create Tables from Other Tables Question: - Create three tables: - Jan 2023 jobs - Feb 2023 jobs - Mar 2023 jobs",
    "sql": "CREATE TABLE jan_job_posting AS\nSELECT *\nFROM job_postings_fact\nWHERE EXTRACT(\n        MONTH\n        FROM job_postings_fact.job_posted_date\n    ) = 1 -- change this from 1 to 2 for FEB or 3 for MARCH\nORDER BY job_posted_date ASC;",
    "title": "Create a table from a query"
  },
  {
    "id": "problem11",
    "file": "problem11.sql",
    "topic": "CASE expressions",
    "statement": "Write a query to get number of jobs posting in your local,remote or other locations for the Data Analyst Role.",
    "sql": "SELECT COUNT(job_id) AS num_of_jobs,\n    CASE\n        WHEN job_location = 'Atlanta, GA' THEN 'Local'\n        WHEN job_location = 'Anywhere' THEN 'Remote'\n        ELSE 'On-Site'\n    END AS location_category\nFROM job_postings_fact\nWHERE job_title_short = 'Data Analyst'\nGROUP BY location_category\nLIMIT 1000;",
    "title": "Local, remote or on-site"
  },
  {
    "id": "problem12",
    "file": "problem12.sql",
    "topic": "CASE expressions",
    "statement": "categorize the salaries from each job posting. To see if it fits in a desired salary range - Put salary into different buckets - Define what's a high, standard, or low salary with our own conditions - Why? It is easy to determine which job postings are worth looking at based on salary. Bucketing is a common practice in data analysis when viewing categories. - I only want to look at data analyst roles",
    "sql": "SELECT COUNT(job_id) as num_of_jobs,\n    CASE\n        WHEN salary_year_avg > 150000\n        OR salary_hour_avg * 2080 > 150000 THEN 'High'\n        WHEN salary_year_avg > 100000\n        OR salary_hour_avg * 2080 > 100000 THEN 'Standard'\n        ELSE 'Low'\n    END AS salary_rating\nFROM job_postings_fact\nWHERE job_title_short = 'Data Analyst'\n    AND (\n        salary_hour_avg IS NOT NULL\n        OR salary_year_avg IS NOT NULL\n    )\nGROUP BY salary_rating\nLIMIT 1000;",
    "title": "Salary buckets for Data Analysts"
  },
  {
    "id": "problem13",
    "file": "problem13.sql",
    "topic": "Subqueries and CTEs",
    "statement": "List the names of the companies which has posted jobs with health insuarance",
    "sql": "SELECT name AS company_name\nFROM company_dim\nWHERE company_id IN (\n        SELECT company_id\n        FROM job_postings_fact\n        WHERE job_health_insurance = TRUE\n    )",
    "title": "Companies that offer health insurance"
  },
  {
    "id": "problem14",
    "file": "problem14.sql",
    "topic": "Subqueries and CTEs",
    "statement": "Find the companies that have the most job openings. using CTE",
    "sql": "WITH company_job_postings AS (\n    SELECT company_id,\n        COUNT(job_id) as num_of_jobs\n    FROM job_postings_fact\n    GROUP BY company_id\n)\nSELECT company_dim.name AS company_name,\n    company_job_postings.num_of_jobs AS num_of_openings\nFROM company_dim\n    LEFT JOIN company_job_postings ON company_job_postings.company_id = company_dim.company_id\nORDER BY num_of_openings DESC",
    "note": "In PostgreSQL, descending order puts NULLs first, so companies with no postings head the list. NULLS LAST puts the busiest companies first.",
    "fixed": "WITH company_job_postings AS (\n  SELECT company_id,\n    COUNT(job_id) AS num_of_jobs\n  FROM job_postings_fact\n  GROUP BY company_id\n)\nSELECT company_dim.name AS company_name,\n  company_job_postings.num_of_jobs AS num_of_openings\nFROM company_dim\n  LEFT JOIN company_job_postings ON company_job_postings.company_id = company_dim.company_id\nORDER BY num_of_openings DESC NULLS LAST",
    "title": "Companies with the most openings"
  },
  {
    "id": "problem15",
    "file": "problem15.sql",
    "topic": "Subqueries and CTEs",
    "statement": "Identify the top 10 skills that are most frequently mentioned in job postings. Use a subquery to find the skill IDs with the highest counts in the skills_job_dim table and then join this result with the skills_dim table to get the skill names.",
    "sql": "WITH skill_count AS(\n    SELECT count(job_id) as num_of_jobs,\n        skill_id\n    FROM skills_job_dim\n    GROUP BY skill_id\n)\nSELECT skill_count.num_of_jobs AS no_of_jobs,\n    skills_dim.skills AS skill\nFROM skills_dim\n    LEFT JOIN skill_count ON skills_dim.skill_id = skill_count.skill_id\nLIMIT 10",
    "note": "The problem asks for the ten most frequent skills. My query takes any ten skills because LIMIT 10 has no ORDER BY, and LEFT JOIN keeps skills that never appear.",
    "fixed": "WITH skill_count AS (\n  SELECT COUNT(job_id) AS num_of_jobs,\n    skill_id\n  FROM skills_job_dim\n  GROUP BY skill_id\n)\nSELECT skill_count.num_of_jobs AS no_of_jobs,\n  skills_dim.skills AS skill\nFROM skills_dim\n  INNER JOIN skill_count ON skills_dim.skill_id = skill_count.skill_id\nORDER BY no_of_jobs DESC\nLIMIT 10",
    "title": "Ten most requested skills"
  },
  {
    "id": "problem16",
    "file": "problem16.sql",
    "topic": "Subqueries and CTEs",
    "statement": "Determine the size category ('Small', 'Medium', or 'Large') for each company by first identifying the number of job postings they have. Use a subquery to calculate the total job postings per company. A company is considered 'Small' if it has less than 10 job postings, 'Medium' if the number of job postings is between 10 and 50, and 'Large' if it has more than 50 job postings. Implement a subquery to aggregate job counts per company before classifying them based on size.",
    "sql": "WITH company_categories AS (\n    SELECT company_id,\n        CASE\n            WHEN COUNT(job_id) < 10 THEN 'Small'\n            WHEN COUNT(job_id) > 50 THEN 'Large'\n            ELSE 'Medium'\n        END AS category\n    FROM job_postings_fact\n    GROUP BY company_id\n)\nSELECT company_dim.name as company_name,\n    company_categories.category as category\nFROM company_dim\n    LEFT JOIN company_categories ON company_categories.company_id = company_dim.company_id",
    "title": "Company size categories"
  },
  {
    "id": "problem17",
    "file": "problem17.sql",
    "topic": "Subqueries and CTEs",
    "statement": "Find the count of the number of remote job postings per skill - Display the top 10 skills by their demand in remote jobs - Include skill ID, name, and count of postings requiring the skill",
    "sql": "WITH remote_jobs AS (\n    SELECT job_id AS remote_job_id\n    FROM job_postings_fact\n    WHERE job_location = 'Anywhere'\n),\nremote_skill AS (\n    SELECT COUNT(remote_jobs.remote_job_id) AS num_of_remotejobs,\n        skills_job_dim.skill_id AS skill_id\n    FROM skills_job_dim\n        LEFT JOIN remote_jobs ON remote_jobs.remote_job_id = skills_job_dim.job_id\n    WHERE remote_job_id IS NOT NULL\n    GROUP BY skill_id\n)\nSELECT skills_dim.skill_id AS skill_id,\n    skills_dim.skills AS skill,\n    remote_skill.num_of_remotejobs AS num_of_jobs\nFROM skills_dim\n    LEFT JOIN remote_skill ON remote_skill.skill_id = skills_dim.skill_id\nLIMIT 10",
    "note": "Top 10 by demand needs ORDER BY ... DESC before LIMIT. Without it the result is an arbitrary ten skills.",
    "fixed": "WITH remote_jobs AS (\n  SELECT job_id AS remote_job_id\n  FROM job_postings_fact\n  WHERE job_location = 'Anywhere'\n),\nremote_skill AS (\n  SELECT COUNT(remote_jobs.remote_job_id) AS num_of_remotejobs,\n    skills_job_dim.skill_id AS skill_id\n  FROM skills_job_dim\n    INNER JOIN remote_jobs ON remote_jobs.remote_job_id = skills_job_dim.job_id\n  GROUP BY skill_id\n)\nSELECT skills_dim.skill_id AS skill_id,\n  skills_dim.skills AS skill,\n  remote_skill.num_of_remotejobs AS num_of_jobs\nFROM skills_dim\n  INNER JOIN remote_skill ON remote_skill.skill_id = skills_dim.skill_id\nORDER BY num_of_jobs DESC\nLIMIT 10",
    "title": "Top remote skills"
  },
  {
    "id": "problem18",
    "file": "problem18.sql",
    "topic": "Subqueries and CTEs",
    "statement": "· Get the corresponding skill and skill type for each job posting in q1 . Look at the skills and the type for each job in the first quarter that has a salary > $70,000",
    "sql": "WITH q1_jobs AS (\n    SELECT job_id,\n        salary_year_avg\n    FROM job_postings_fact\n    WHERE EXTRACT(\n            MONTH\n            FROM job_posted_date\n        ) < 4\n        AND salary_year_avg > 70000\n),\nq1_skills AS (\n    SELECT skills_job_dim.skill_id AS skill_id,\n        q1_jobs.job_id as job_id,\n        q1_jobs.salary_year_avg as salary\n    FROM skills_job_dim\n        LEFT JOIN q1_jobs ON q1_jobs.job_id = skills_job_dim.job_id\n    WHERE q1_jobs.job_id IS NOT NULL\n)\nSELECT q1_skills.job_id as job_id,\n    skills_dim.skills as skill,\n    skills_dim.type as skill_type\nFROM skills_dim\n    LEFT JOIN q1_skills ON q1_skills.skill_id = skills_dim.skill_id",
    "note": "Starting from skills_dim with a LEFT JOIN also returns every skill that no Q1 job needs, with an empty job_id. Starting from the jobs and joining inward returns only real job and skill pairs.",
    "fixed": "WITH q1_jobs AS (\n  SELECT job_id,\n    salary_year_avg\n  FROM job_postings_fact\n  WHERE EXTRACT(MONTH FROM job_posted_date) < 4\n    AND salary_year_avg > 70000\n)\nSELECT q1_jobs.job_id AS job_id,\n  skills_dim.skills AS skill,\n  skills_dim.type AS skill_type\nFROM q1_jobs\n  INNER JOIN skills_job_dim ON skills_job_dim.job_id = q1_jobs.job_id\n  INNER JOIN skills_dim ON skills_dim.skill_id = skills_job_dim.skill_id\nORDER BY q1_jobs.job_id",
    "title": "Skills for well-paid Q1 jobs"
  },
  {
    "id": "problem19",
    "file": "problem19.sql",
    "topic": "Subqueries and CTEs",
    "statement": "Top 10 highest-paying job postings with a salary, converting hourly rates to yearly with 1,920 hours. (My file has no problem statement; this one was written for the lab.)",
    "sql": "WITH salary AS (\n    SELECT job_id AS salary_job_id,\n        CASE\n            WHEN salary_hour_avg IS NOT NULL THEN salary_hour_avg * 1920\n            ELSE salary_year_avg\n        END AS salary_yearly\n    FROM job_postings_fact\n    WHERE salary_hour_avg IS NOT NULL\n        OR salary_year_avg IS NOT NULL\n    LIMIT 1000\n)\nSELECT postings.job_id,\n    postings.job_title,\n    postings.job_location,\n    salary.salary_yearly AS salary\nFROM job_postings_fact as postings\n    LEFT JOIN salary ON salary.salary_job_id = postings.job_id\nWHERE salary IS NOT NULL --AND job_location = 'Anywhere' AND --for remote\n    -- job_title LIKE '%Analyst%' -- for analyst jobs\nORDER BY salary DESC\nLIMIT 10",
    "title": "Top ten salaries with hourly pay converted"
  }
];
