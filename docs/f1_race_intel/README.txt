F1 RACE INTELLIGENCE  (folder: f1_race_intel)
=============================================
Folder:  projects/f1_race_intel
Type:    Full-stack Formula 1 analytics, prediction and assistant platform
Stack:   Next.js web app ("Pit Wall" cockpit), FastAPI backend, PostgreSQL 16,
         Parquet telemetry traces, calibrated XGBoost podium model with a
         chronological backtest, data from Jolpica (results) and FastF1 /
         OpenF1 (laps and 20 Hz telemetry), tool-calling LLM assistant
Runs on: web http://localhost:3002 (dashboard-allocated port), API
         http://localhost:4001, PostgreSQL 5001

WHAT IT IS
----------
Three modules in one cockpit. Race Weekend Intelligence predicts podium
probabilities at two cut-offs (pre-weekend and post-qualifying) with feature
attribution and calibration. The Race Dashboard and Telemetry Duel compares
two drivers' laps on a uniform 20 m distance axis (speed, throttle, brake and
a continuous time delta). The Data Assistant answers questions only through
validated database functions and links every answer to its evidence, so it
cannot invent telemetry.

FLOWS (screenshots in this folder)
----------------------------------
01-home.png         Cockpit dashboard: 2026 season, circuit locations, the
                    championship battle by round and constructor points.
02-standings.png    Standings with tabs for overview and evolution, driver
                    standings, driver ratings, teams and cars, constructors
                    and the calendar.
03-races.png        2026 calendar and circuits, as a radar map or a grid.
04-telemetry.png    Telemetry duel before comparing.
10-telemetry-compare.png
                    Compare traces: VER vs HAM, lap 15 on softs, 1:28.412
                    against 1:28.684, a +1.266 s calculated delta and the
                    time-delta curve along the track distance.
05-pit-stops.png    Pit stop times and team rankings.
06-predictor.png    Podium predictor: calibrated probabilities per driver.
13-predictor-post-qualifying.png
                    The same view switched to the post-qualifying cut-off.
07-head-to-head.png Driver head-to-head duel with one-click team duels.
11-head-to-head-red-bull.png
                    The Red Bull duel.
08-assistant.png    Assistant with suggested questions.
12-assistant-answer.png
                    "Why does Verstappen have a higher podium probability
                    than Leclerc?": the answer cites the 88% vs 38%
                    post-qualifying probabilities and the factors behind
                    them, lists the tools it called (get_prediction,
                    get_driver_form) and links to the prediction page.
09-methodology.png  Data sources, strict temporal prediction cut-offs,
                    distance-axis telemetry interpolation and data limits.

NOTES
-----
- The dashboard allocates the web app to port 3002. When these screenshots
  were taken another program held 3002, so the web container was started on
  3102 with a temporary override; the project and the registry were not
  changed.
- On the calendar page the Grand Prix list shows 0 rounds in this local
  database, and the telemetry page's Grand Prix selector is empty, yet the
  comparison renders from the loaded session data.

HOW TO RUN
----------
From the mydocker dashboard: type "f1_race_intel" then "up", then "open".
