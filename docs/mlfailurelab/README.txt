ML FAILURE LAB
==============
Folder:  projects/mlfailurelab
Type:    Model-diagnostics web app (upload predictions, find where a
         classifier or regressor fails)
Stack:   Next.js web app, FastAPI (Python) API, background worker, PostgreSQL,
         MinIO (file storage), Mailpit (dev mail), MLflow integration
Runs on: web http://localhost:3004, API http://localhost:4003 (OpenAPI at
         /docs); Postgres 5007, MinIO 5008/5009, Mailpit 5010

WHAT IT IS
----------
"Your model scored 91%. Find out who it fails." Upload a CSV or Parquet of
true labels and predictions, map the columns, and it analyses the run in the
background: class-level metrics, a clickable confusion matrix that opens the
exact samples, calibration, automatic failure-slice discovery with bootstrap
confidence intervals and multiple-comparison control, a threshold simulator,
run-to-run comparison, drift monitoring, and an exportable report. It handles
binary, multiclass, multilabel and regression problems.

FLOWS (screenshots in this folder)
----------------------------------
01-home.png         Landing page.
03-register.png     Create an account (name, email, password).
02-login.png        Sign in.
04-forgot-password.png
                    Password reset by email link.
04-projects-list.png
                    Projects: each holds the files and analyses for one
                    model. (A throwaway account and a project named "Fraud
                    model demo" were created in the local database to take
                    these screenshots.)
05-upload.png       Upload: drop a CSV/Parquet or try a bundled demo
                    (imbalanced fraud model, and others).
06-column-mapping.png
                    Choosing the demo reads the file (20,000 rows) and
                    guesses what each column means: true label, predicted
                    label, probabilities and metadata for slice discovery.
07-file-check.png   "Check my file": validation with fixable, human-readable
                    messages before analysis.
08-run-overview.png Run overview after "Analyze this model": headline
                    finding (recall is 3% for small transactions on accounts
                    under about 20 days old, holding 66% of all false
                    negatives), overall metrics (accuracy 97.9% but balanced
                    accuracy 83.3%), which classes are missed, confidence
                    check, and every finding ranked by severity.
09-classes.png      Per-class precision, recall and support.
10-confusion.png    Confusion matrix; each cell opens the samples behind it.
11-calibration.png  Reliability diagram: the model is underconfident.
12-failure-slices.png
                    Automatically discovered weak segments with sample
                    counts, confidence intervals and share of false
                    negatives.
13-threshold.png    Threshold simulator: move the decision threshold and see
                    precision and recall trade off.
14-report.png       The shareable report.

HOW TO RUN
----------
From the mydocker dashboard: type "mlfailurelab" then "up", then "open".
The first start builds api, worker and web images.
