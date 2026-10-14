CITYOPS - NYC 311 OPERATIONS INTELLIGENCE
=========================================
Folder:  projects/cityops
Type:    Data analytics web app (read-only portfolio case study)
Stack:   Next.js App Router dashboard, NestJS API (REST + Swagger + GraphQL),
         PostgreSQL, staged NYC SODA ingestion, Python baseline and
         logistic-regression experiment
Runs on: web http://localhost:3001 (dashboard-allocated port), API
         http://localhost:4000 (Swagger at /docs), PostgreSQL 5000

WHAT IT IS
----------
An independent investigation tool for NYC 311 service requests, not an
official city system. The first release covers January 2025 for three
problems (Noise - Residential, HEAT/HOT WATER, Illegal Parking): 181,205
source requests, profiled and reconciled, with the last real refresh time
shown instead of a claim of live data. It separates how many problems were
reported from how long they took to close, keeps definitions next to every
chart, and is honest about limits: the seven-day risk model did not beat a
grouped baseline on the held-out period, so no ranking is published.

FLOWS (screenshots in this folder)
----------------------------------
01-home.png         Entry page: "Understand the work behind the numbers".
02-dashboard.png    Overview: 63,477 requests created Jan 18-31, -34.3%
                    against the preceding 14 days, 3 still open, 99.962%
                    closed within seven days, median 10.2 h to close; filters
                    for dates, borough, problem, agency, board and ZIP.
03-dashboard-noise-filter.png
                    The same overview filtered to Noise - Residential (the
                    filter is kept in the URL so views can be shared).
04-explore.png      Explore: the individual requests behind the chart,
                    sortable list with exact-ID search and a capped CSV
                    export.
11-request-detail.png
                    A request's detail drawer: problem, created and closed
                    times (NYC local), agency, area, valid close duration,
                    quality flags, last imported, and a link to the source
                    record.
05-map-heat-hot-water.png
                    Borough map of HEAT/HOT WATER reports (official NYC DCP
                    boundaries): the Bronx has 11,422 of 30,624.
06-resolution.png   How long requests take to close: closure by creation
                    week, age of open requests, distribution by problem.
07-insights.png     Two source-checked findings with their assumptions and
                    how the counts were verified.
08-risk.png         Seven-day unresolved estimate: ranking withheld after
                    testing, with measured held-out results shown instead.
10-methodology.png  Definitions, data source, latest ingestion status.
09-api-swagger.png  The NestJS API's interactive documentation.

NOTES
-----
- The dashboard's port allocation puts the web app on 3001. When these
  screenshots were taken something else already held 3001, so the web
  container was started on 3101 with a temporary override; nothing in the
  project or the registry was changed.
- The browser console shows a React hydration warning (error 418) on page
  load; the pages render correctly.

HOW TO RUN
----------
From the mydocker dashboard: type "cityops" then "up", then "open"
(and "open docs" for Swagger).
