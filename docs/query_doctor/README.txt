QUERYDOCTOR
===========
Folder:  projects/query_doctor
Type:    Evidence-based PostgreSQL and MongoDB performance investigator
Stack:   Next.js web app (React Flow plan viewer), FastAPI (Python) API with
         a worker, PostgreSQL 16 (sample, benchmark and metadata instances),
         MongoDB 7, Redis, a learned model that ranks index suggestions
Runs on: web http://localhost:3003, API http://localhost:4002 (OpenAPI at
         /docs); seven supporting containers (databases, redis, worker, seed)

WHAT IT IS
----------
Give it a slow SELECT (or a MongoDB find/aggregate). It reads the execution
plan, finds the bottleneck, tests index ideas with the planner without
creating them, benchmarks the promising ones in an isolated copy of the data
and recommends only what the measurements support. Every evidence level is
labelled: suggested, planner-validated (what-if test) or benchmark-validated
(measured). Explanations are generated from measurements; nothing a language
model writes can change an evidence level, and the analysed database is never
modified.

FLOWS (screenshots in this folder)
----------------------------------
01-home.png         Home: "Find out why a query is slow", sample slow
                    queries to try and recent analyses.
02-analyses-new.png New analysis: choose PostgreSQL or MongoDB, paste SQL and
                    parameters, pick Explain only or Execute with analysis,
                    or start from one of eight deliberately slow samples.
07-new-analysis-sample-selected.png
                    Sample "Recent orders for one customer" loaded.
08-analysis-result.png / 09-analysis-result-full.png
                    The finished analysis: planning and execution time, the
                    plan as a graph (Seq Scan on orders is the slowest step,
                    93% of the time), the finding "97.2% of visited rows were
                    discarded", and ranked index ideas with a predicted
                    speed-up (about 20x) and the evidence level.
10-benchmark-result-full.png
                    Ticking the consent box and running the benchmark builds
                    the index in an isolated copy and measures 7 runs on each
                    side: 95.4% faster (median 6 ms to 0.26 ms), same output,
                    chart of every run, index size and build time.
03-workload.png     Workload: queries ranked by total time, panels and
                    regressions; import statistics, generate demo traffic or
                    simulate a regression.
11-workload-demo-traffic.png
                    After generating demo traffic.
04-projects.png     History by query and all analyses.
05-models.png       The recommendation model: what it predicts, how
                    suggestions are ordered, how models compare, training
                    data.
06-settings.png     What QueryDoctor does to the database, privacy, and how
                    to connect your own databases.

HOW TO RUN
----------
From the mydocker dashboard: type "query_doctor" then "up" (it brings up the
whole stack, so the first start takes a few minutes), then "open".
