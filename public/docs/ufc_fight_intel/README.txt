UFC FIGHT INTEL
===============
Folder:  projects/ufc_fight_intel  (the app lives in app/)
Type:    Full-stack data and prediction web app
Stack:   Next.js 16 (App Router, TypeScript), MongoDB + Mongoose, Tailwind 4,
         Node scraper (cheerio), Python (pymongo, scikit-learn) for rankings,
         features and the win model
Runs on: http://localhost:3011  (container "web"; MongoDB is on the host)

WHAT IT IS
----------
Fight intelligence for UFC: a fight-card dashboard, a published win
probability for every upcoming bout with the factors behind it, official
rankings per division, a head-to-head "Style Duel" with a round-by-round
explorer, a chronological backtest of the model, and a data assistant whose
answers come only from the database.

DATA PIPELINE
-------------
ufcstats.com -> scraper -> MongoDB -> features -> Elo + logistic model
             -> Next.js pages, REST API and assistant
Rankings and photos come from ufc.com, full pro records from Sherdog. The
scraper solves the site's proof-of-work challenge and rate-limits itself.
Ingestion is idempotent, so re-running never duplicates rows.

PAGES AND FLOWS (screenshots in this folder)
--------------------------------------------
01-home.png        Home: next event card with predicted winners, pound-for-
                   pound rankings, and the public prediction record.
02-events.png      Events: upcoming and past cards.
10-event-card.png  One event: every bout on the card with the model's pick.
09-bout.png        One bout: the model's probability (33% vs 67%) next to an
                   Elo baseline, a confidence label, the factors that moved
                   it with their pre-fight values and impact, and a tale of
                   the tape (record, age, height, reach).
08-fighter.png     Fighter profile: record, physical stats and fight history.
03-rankings.png    Rankings: men's pound-for-pound and every division.
12-rankings-lightweight.png
                   Switching the division tab to Lightweight.
04-matchup.png     Style Duel: pick two fighters and compare styles, with the
                   round-by-round explorer.
05-predictions.png Prediction record: settled predictions and a chronological
                   backtest against the Elo baseline (the settled list is
                   empty until events complete after publication).
06-assistant.png   Assistant: suggested questions and a free-text box.
11-assistant-answer.png
                   Asking "Who is on the next card?" returns the card with
                   model probabilities, the data source and a link to the
                   full card. If the data is not there it says so.
07-methodology.png What is predicted, how results are treated, data sources
                   and limits (estimates, not betting advice).

HOW TO RUN
----------
From the mydocker dashboard: type "ufc_fight_intel" then "up", then "open".
Needs MongoDB on the host (the compose file points the container at
host.docker.internal:27017).
