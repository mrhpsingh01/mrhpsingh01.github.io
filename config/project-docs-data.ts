// Generated from docs/ folders
export interface ProjectDocImage {
  src: string;
  filename: string;
  title: string;
  caption: string;
}

export interface ProjectDoc {
  slug: string;
  folder: string;
  title: string;
  type: string;
  stack: string;
  runsOn: string;
  whatItIs: string;
  notes: string;
  howToRun: string;
  rawReadme: string;
  images: ProjectDocImage[];
}

export const projectDocs: Record<string, ProjectDoc> = {
  "cityops": {
    "slug": "cityops",
    "folder": "cityops",
    "title": "CITYOPS  NYC 311 OPERATIONS INTELLIGENCE",
    "type": "Data analytics web app (read-only portfolio case study)",
    "stack": "Next.js App Router dashboard, NestJS API (REST + Swagger + GraphQL), PostgreSQL, staged NYC SODA ingestion, Python baseline and logistic-regression experiment",
    "runsOn": "web http://localhost:3001 (dashboard-allocated port), API http://localhost:4000 (Swagger at /docs), PostgreSQL 5000",
    "whatItIs": "An independent investigation tool for NYC 311 service requests, not an\nofficial city system. The first release covers January 2025 for three\nproblems (Noise - Residential, HEAT/HOT WATER, Illegal Parking): 181,205\nsource requests, profiled and reconciled, with the last real refresh time\nshown instead of a claim of live data. It separates how many problems were\nreported from how long they took to close, keeps definitions next to every\nchart, and is honest about limits: the seven-day risk model did not beat a\ngrouped baseline on the held-out period, so no ranking is published.",
    "notes": "- The dashboard's port allocation puts the web app on 3001. When these\n  screenshots were taken something else already held 3001, so the web\n  container was started on 3101 with a temporary override; nothing in the\n  project or the registry was changed.\n- The browser console shows a React hydration warning (error 418) on page\n  load; the pages render correctly.",
    "howToRun": "From the mydocker dashboard: type \"cityops\" then \"up\", then \"open\"\n(and \"open docs\" for Swagger).",
    "rawReadme": "CITYOPS - NYC 311 OPERATIONS INTELLIGENCE\n=========================================\nFolder:  projects/cityops\nType:    Data analytics web app (read-only portfolio case study)\nStack:   Next.js App Router dashboard, NestJS API (REST + Swagger + GraphQL),\n         PostgreSQL, staged NYC SODA ingestion, Python baseline and\n         logistic-regression experiment\nRuns on: web http://localhost:3001 (dashboard-allocated port), API\n         http://localhost:4000 (Swagger at /docs), PostgreSQL 5000\n\nWHAT IT IS\n----------\nAn independent investigation tool for NYC 311 service requests, not an\nofficial city system. The first release covers January 2025 for three\nproblems (Noise - Residential, HEAT/HOT WATER, Illegal Parking): 181,205\nsource requests, profiled and reconciled, with the last real refresh time\nshown instead of a claim of live data. It separates how many problems were\nreported from how long they took to close, keeps definitions next to every\nchart, and is honest about limits: the seven-day risk model did not beat a\ngrouped baseline on the held-out period, so no ranking is published.\n\nFLOWS (screenshots in this folder)\n----------------------------------\n01-home.png         Entry page: \"Understand the work behind the numbers\".\n02-dashboard.png    Overview: 63,477 requests created Jan 18-31, -34.3%\n                    against the preceding 14 days, 3 still open, 99.962%\n                    closed within seven days, median 10.2 h to close; filters\n                    for dates, borough, problem, agency, board and ZIP.\n03-dashboard-noise-filter.png\n                    The same overview filtered to Noise - Residential (the\n                    filter is kept in the URL so views can be shared).\n04-explore.png      Explore: the individual requests behind the chart,\n                    sortable list with exact-ID search and a capped CSV\n                    export.\n11-request-detail.png\n                    A request's detail drawer: problem, created and closed\n                    times (NYC local), agency, area, valid close duration,\n                    quality flags, last imported, and a link to the source\n                    record.\n05-map-heat-hot-water.png\n                    Borough map of HEAT/HOT WATER reports (official NYC DCP\n                    boundaries): the Bronx has 11,422 of 30,624.\n06-resolution.png   How long requests take to close: closure by creation\n                    week, age of open requests, distribution by problem.\n07-insights.png     Two source-checked findings with their assumptions and\n                    how the counts were verified.\n08-risk.png         Seven-day unresolved estimate: ranking withheld after\n                    testing, with measured held-out results shown instead.\n10-methodology.png  Definitions, data source, latest ingestion status.\n09-api-swagger.png  The NestJS API's interactive documentation.\n\nNOTES\n-----\n- The dashboard's port allocation puts the web app on 3001. When these\n  screenshots were taken something else already held 3001, so the web\n  container was started on 3101 with a temporary override; nothing in the\n  project or the registry was changed.\n- The browser console shows a React hydration warning (error 418) on page\n  load; the pages render correctly.\n\nHOW TO RUN\n----------\nFrom the mydocker dashboard: type \"cityops\" then \"up\", then \"open\"\n(and \"open docs\" for Swagger).\n",
    "images": [
      {
        "src": "/docs/cityops/01-home.png",
        "filename": "01-home.png",
        "title": "Home",
        "caption": "Entry page: \"Understand the work behind the numbers\"."
      },
      {
        "src": "/docs/cityops/02-dashboard.png",
        "filename": "02-dashboard.png",
        "title": "Dashboard",
        "caption": "Overview: 63,477 requests created Jan 18-31, -34.3% against the preceding 14 days, 3 still open, 99.962% closed within seven days, median 10.2 h to close; filters for dates, borough, problem, agency, board and ZIP."
      },
      {
        "src": "/docs/cityops/03-dashboard-noise-filter.png",
        "filename": "03-dashboard-noise-filter.png",
        "title": "Dashboard noise filter",
        "caption": "The same overview filtered to Noise - Residential (the filter is kept in the URL so views can be shared)."
      },
      {
        "src": "/docs/cityops/04-explore.png",
        "filename": "04-explore.png",
        "title": "Explore",
        "caption": "Explore: the individual requests behind the chart, sortable list with exact-ID search and a capped CSV export."
      },
      {
        "src": "/docs/cityops/05-map-heat-hot-water.png",
        "filename": "05-map-heat-hot-water.png",
        "title": "Map heat hot water",
        "caption": "Borough map of HEAT/HOT WATER reports (official NYC DCP boundaries): the Bronx has 11,422 of 30,624."
      },
      {
        "src": "/docs/cityops/06-resolution.png",
        "filename": "06-resolution.png",
        "title": "Resolution",
        "caption": "How long requests take to close: closure by creation week, age of open requests, distribution by problem."
      },
      {
        "src": "/docs/cityops/07-insights.png",
        "filename": "07-insights.png",
        "title": "Insights",
        "caption": "Two source-checked findings with their assumptions and how the counts were verified."
      },
      {
        "src": "/docs/cityops/08-risk.png",
        "filename": "08-risk.png",
        "title": "Risk",
        "caption": "Seven-day unresolved estimate: ranking withheld after testing, with measured held-out results shown instead."
      },
      {
        "src": "/docs/cityops/09-api-swagger.png",
        "filename": "09-api-swagger.png",
        "title": "Api swagger",
        "caption": "The NestJS API's interactive documentation."
      },
      {
        "src": "/docs/cityops/10-methodology.png",
        "filename": "10-methodology.png",
        "title": "Methodology",
        "caption": "Definitions, data source, latest ingestion status."
      },
      {
        "src": "/docs/cityops/11-request-detail.png",
        "filename": "11-request-detail.png",
        "title": "Request detail",
        "caption": "A request's detail drawer: problem, created and closed times (NYC local), agency, area, valid close duration, quality flags, last imported, and a link to the source record."
      }
    ]
  },
  "ringside": {
    "slug": "ringside",
    "folder": "dawgsss",
    "title": "RINGSIDE  (folder: dawgsss)",
    "type": "Real-time watch-party and sports-companion web app (plus an Expo mobile app in mobile/)",
    "stack": "React 18 + Vite, Node/Express server with Socket.IO, optional MongoDB (runs in local demo mode without it), Expo for Android",
    "runsOn": "http://localhost:3010  (container \"web\"; the server serves the built React app and the realtime API on one port)",
    "whatItIs": "A place for a household to watch sport together: a room per event with chat,\nlive reactions and polls, spoiler-safe delivery that delays messages to match\neach viewer's stream offset, fantasy pick'ems, league tables, and a household\npresence board. A live sports desk merges five public data providers into one\nresponse (UFC rankings and events, F1 standings, football leagues, college\nfootball, cricket), caches it for five minutes and reports provider health.\nWhen the providers cannot be reached it falls back to saved snapshots, which\nis the \"Offline snapshots\" badge in the header.",
    "notes": "",
    "howToRun": "From the mydocker dashboard: type \"dawgsss\" then \"up\", then \"open\".\nWithout Docker: npm install && npm run build && npm start (port 3002), or\nnpm run dev for Vite on 5173.",
    "rawReadme": "RINGSIDE  (folder: dawgsss)\n===========================\nFolder:  projects/dawgsss\nType:    Real-time watch-party and sports-companion web app (plus an Expo\n         mobile app in mobile/)\nStack:   React 18 + Vite, Node/Express server with Socket.IO, optional\n         MongoDB (runs in local demo mode without it), Expo for Android\nRuns on: http://localhost:3010  (container \"web\"; the server serves the\n         built React app and the realtime API on one port)\n\nWHAT IT IS\n----------\nA place for a household to watch sport together: a room per event with chat,\nlive reactions and polls, spoiler-safe delivery that delays messages to match\neach viewer's stream offset, fantasy pick'ems, league tables, and a household\npresence board. A live sports desk merges five public data providers into one\nresponse (UFC rankings and events, F1 standings, football leagues, college\nfootball, cricket), caches it for five minutes and reports provider health.\nWhen the providers cannot be reached it falls back to saved snapshots, which\nis the \"Offline snapshots\" badge in the header.\n\nFLOWS (screenshots in this folder)\n----------------------------------\nFirst visit asks for a display name (\"Join the house\"); the name and points\nstay attached to the browser profile.\n\n01-home.png         Discover: hero with the next room, \"your all-sports\n                    rundown\" cards (F1, football, college football, cricket),\n                    league leaders for MMA, F1 and soccer, and the house chat\n                    pulse.\n02-watch-rooms.png  A live watch room (Holloway vs Poirier 3): event switcher\n                    along the top, the fight stage with round and clock,\n                    batched live reactions, a live poll (\"Who wins this\n                    round?\"), and a side panel with room chat / Game yak.\n                    Spoiler-safe delivery shows the stream offset slider and\n                    delays chat accordingly.\n03-create-event.png \"Pick the next thing the house watches\": event tiles per\n                    sport with invited viewers, and Create an event.\n04-upcoming.png     Upcoming fixtures across the sports.\n05-pick.png         Fight card pick'em: choose three fighters within a budget\n                    of 100 to build a lineup; tabs for MMA, F1, soccer,\n                    college football and cricket.\n06-standings.png    Standings tables per sport.\n07-household.png    Household presence: who is home, away or maybe home,\n                    inferred from door and motion events, never a camera.\n08-recaps.png       Recaps tab. Observation: at the time of capture this tab\n                    renders the same presence list as Household under a\n                    \"Fight night recaps\" heading.\n\nHOW TO RUN\n----------\nFrom the mydocker dashboard: type \"dawgsss\" then \"up\", then \"open\".\nWithout Docker: npm install && npm run build && npm start (port 3002), or\nnpm run dev for Vite on 5173.\n",
    "images": [
      {
        "src": "/docs/dawgsss/01-home.png",
        "filename": "01-home.png",
        "title": "Home",
        "caption": "Discover: hero with the next room, \"your all-sports rundown\" cards (F1, football, college football, cricket), league leaders for MMA, F1 and soccer, and the house chat pulse."
      },
      {
        "src": "/docs/dawgsss/02-watch-rooms.png",
        "filename": "02-watch-rooms.png",
        "title": "Watch rooms",
        "caption": "A live watch room (Holloway vs Poirier 3): event switcher along the top, the fight stage with round and clock, batched live reactions, a live poll (\"Who wins this round?\"), and a side panel with room chat / Game yak. Spoiler-safe delivery shows the stream offset slider and delays chat accordingly."
      },
      {
        "src": "/docs/dawgsss/03-create-event.png",
        "filename": "03-create-event.png",
        "title": "Create event",
        "caption": "\"Pick the next thing the house watches\": event tiles per sport with invited viewers, and Create an event."
      },
      {
        "src": "/docs/dawgsss/04-upcoming.png",
        "filename": "04-upcoming.png",
        "title": "Upcoming",
        "caption": "Upcoming fixtures across the sports."
      },
      {
        "src": "/docs/dawgsss/05-pick.png",
        "filename": "05-pick.png",
        "title": "Pick",
        "caption": "Fight card pick'em: choose three fighters within a budget of 100 to build a lineup; tabs for MMA, F1, soccer, college football and cricket."
      },
      {
        "src": "/docs/dawgsss/06-standings.png",
        "filename": "06-standings.png",
        "title": "Standings",
        "caption": "Standings tables per sport."
      },
      {
        "src": "/docs/dawgsss/07-household.png",
        "filename": "07-household.png",
        "title": "Household",
        "caption": "Household presence: who is home, away or maybe home, inferred from door and motion events, never a camera."
      },
      {
        "src": "/docs/dawgsss/08-recaps.png",
        "filename": "08-recaps.png",
        "title": "Recaps",
        "caption": "Recaps tab. Observation: at the time of capture this tab renders the same presence list as Household under a \"Fight night recaps\" heading."
      }
    ]
  },
  "f1-race-intelligence": {
    "slug": "f1-race-intelligence",
    "folder": "f1_race_intel",
    "title": "F1 RACE INTELLIGENCE  (folder: f1raceintel)",
    "type": "Full-stack Formula 1 analytics, prediction and assistant platform",
    "stack": "Next.js web app (\"Pit Wall\" cockpit), FastAPI backend, PostgreSQL 16, Parquet telemetry traces, calibrated XGBoost podium model with a chronological backtest, data from Jolpica (results) and FastF1 / OpenF1 (laps and 20 Hz telemetry), tool-calling LLM assistant",
    "runsOn": "web http://localhost:3002 (dashboard-allocated port), API http://localhost:4001, PostgreSQL 5001",
    "whatItIs": "Three modules in one cockpit. Race Weekend Intelligence predicts podium\nprobabilities at two cut-offs (pre-weekend and post-qualifying) with feature\nattribution and calibration. The Race Dashboard and Telemetry Duel compares\ntwo drivers' laps on a uniform 20 m distance axis (speed, throttle, brake and\na continuous time delta). The Data Assistant answers questions only through\nvalidated database functions and links every answer to its evidence, so it\ncannot invent telemetry.",
    "notes": "- The dashboard allocates the web app to port 3002. When these screenshots\n  were taken another program held 3002, so the web container was started on\n  3102 with a temporary override; the project and the registry were not\n  changed.\n- On the calendar page the Grand Prix list shows 0 rounds in this local\n  database, and the telemetry page's Grand Prix selector is empty, yet the\n  comparison renders from the loaded session data.",
    "howToRun": "From the mydocker dashboard: type \"f1_race_intel\" then \"up\", then \"open\".",
    "rawReadme": "F1 RACE INTELLIGENCE  (folder: f1_race_intel)\n=============================================\nFolder:  projects/f1_race_intel\nType:    Full-stack Formula 1 analytics, prediction and assistant platform\nStack:   Next.js web app (\"Pit Wall\" cockpit), FastAPI backend, PostgreSQL 16,\n         Parquet telemetry traces, calibrated XGBoost podium model with a\n         chronological backtest, data from Jolpica (results) and FastF1 /\n         OpenF1 (laps and 20 Hz telemetry), tool-calling LLM assistant\nRuns on: web http://localhost:3002 (dashboard-allocated port), API\n         http://localhost:4001, PostgreSQL 5001\n\nWHAT IT IS\n----------\nThree modules in one cockpit. Race Weekend Intelligence predicts podium\nprobabilities at two cut-offs (pre-weekend and post-qualifying) with feature\nattribution and calibration. The Race Dashboard and Telemetry Duel compares\ntwo drivers' laps on a uniform 20 m distance axis (speed, throttle, brake and\na continuous time delta). The Data Assistant answers questions only through\nvalidated database functions and links every answer to its evidence, so it\ncannot invent telemetry.\n\nFLOWS (screenshots in this folder)\n----------------------------------\n01-home.png         Cockpit dashboard: 2026 season, circuit locations, the\n                    championship battle by round and constructor points.\n02-standings.png    Standings with tabs for overview and evolution, driver\n                    standings, driver ratings, teams and cars, constructors\n                    and the calendar.\n03-races.png        2026 calendar and circuits, as a radar map or a grid.\n04-telemetry.png    Telemetry duel before comparing.\n10-telemetry-compare.png\n                    Compare traces: VER vs HAM, lap 15 on softs, 1:28.412\n                    against 1:28.684, a +1.266 s calculated delta and the\n                    time-delta curve along the track distance.\n05-pit-stops.png    Pit stop times and team rankings.\n06-predictor.png    Podium predictor: calibrated probabilities per driver.\n13-predictor-post-qualifying.png\n                    The same view switched to the post-qualifying cut-off.\n07-head-to-head.png Driver head-to-head duel with one-click team duels.\n11-head-to-head-red-bull.png\n                    The Red Bull duel.\n08-assistant.png    Assistant with suggested questions.\n12-assistant-answer.png\n                    \"Why does Verstappen have a higher podium probability\n                    than Leclerc?\": the answer cites the 88% vs 38%\n                    post-qualifying probabilities and the factors behind\n                    them, lists the tools it called (get_prediction,\n                    get_driver_form) and links to the prediction page.\n09-methodology.png  Data sources, strict temporal prediction cut-offs,\n                    distance-axis telemetry interpolation and data limits.\n\nNOTES\n-----\n- The dashboard allocates the web app to port 3002. When these screenshots\n  were taken another program held 3002, so the web container was started on\n  3102 with a temporary override; the project and the registry were not\n  changed.\n- On the calendar page the Grand Prix list shows 0 rounds in this local\n  database, and the telemetry page's Grand Prix selector is empty, yet the\n  comparison renders from the loaded session data.\n\nHOW TO RUN\n----------\nFrom the mydocker dashboard: type \"f1_race_intel\" then \"up\", then \"open\".\n",
    "images": [
      {
        "src": "/docs/f1_race_intel/01-home.png",
        "filename": "01-home.png",
        "title": "Home",
        "caption": "Cockpit dashboard: 2026 season, circuit locations, the championship battle by round and constructor points."
      },
      {
        "src": "/docs/f1_race_intel/02-standings.png",
        "filename": "02-standings.png",
        "title": "Standings",
        "caption": "Standings with tabs for overview and evolution, driver standings, driver ratings, teams and cars, constructors and the calendar."
      },
      {
        "src": "/docs/f1_race_intel/03-races.png",
        "filename": "03-races.png",
        "title": "Races",
        "caption": "2026 calendar and circuits, as a radar map or a grid."
      },
      {
        "src": "/docs/f1_race_intel/04-telemetry.png",
        "filename": "04-telemetry.png",
        "title": "Telemetry",
        "caption": "Telemetry duel before comparing."
      },
      {
        "src": "/docs/f1_race_intel/05-pit-stops.png",
        "filename": "05-pit-stops.png",
        "title": "Pit stops",
        "caption": "Pit stop times and team rankings."
      },
      {
        "src": "/docs/f1_race_intel/06-predictor.png",
        "filename": "06-predictor.png",
        "title": "Predictor",
        "caption": "Podium predictor: calibrated probabilities per driver."
      },
      {
        "src": "/docs/f1_race_intel/07-head-to-head.png",
        "filename": "07-head-to-head.png",
        "title": "Head to head",
        "caption": "Driver head-to-head duel with one-click team duels."
      },
      {
        "src": "/docs/f1_race_intel/08-assistant.png",
        "filename": "08-assistant.png",
        "title": "Assistant",
        "caption": "Assistant with suggested questions."
      },
      {
        "src": "/docs/f1_race_intel/09-methodology.png",
        "filename": "09-methodology.png",
        "title": "Methodology",
        "caption": "Data sources, strict temporal prediction cut-offs, distance-axis telemetry interpolation and data limits."
      },
      {
        "src": "/docs/f1_race_intel/10-telemetry-compare.png",
        "filename": "10-telemetry-compare.png",
        "title": "Telemetry compare",
        "caption": "Compare traces: VER vs HAM, lap 15 on softs, 1:28.412 against 1:28.684, a +1.266 s calculated delta and the time-delta curve along the track distance."
      },
      {
        "src": "/docs/f1_race_intel/11-head-to-head-red-bull.png",
        "filename": "11-head-to-head-red-bull.png",
        "title": "Head to head red bull",
        "caption": "The Red Bull duel."
      },
      {
        "src": "/docs/f1_race_intel/12-assistant-answer.png",
        "filename": "12-assistant-answer.png",
        "title": "Assistant answer",
        "caption": "\"Why does Verstappen have a higher podium probability than Leclerc?\": the answer cites the 88% vs 38% post-qualifying probabilities and the factors behind them, lists the tools it called (get_prediction, get_driver_form) and links to the prediction page."
      },
      {
        "src": "/docs/f1_race_intel/13-predictor-post-qualifying.png",
        "filename": "13-predictor-post-qualifying.png",
        "title": "Predictor post qualifying",
        "caption": "The same view switched to the post-qualifying cut-off."
      }
    ]
  },
  "launchhelp": {
    "slug": "launchhelp",
    "folder": "launchhelp",
    "title": "LAUNCHHELP",
    "type": "Interactive learning lab: from a product idea to a buildable plan",
    "stack": "React + Vite + TypeScript (single-page app, hash routes), Vitest, Playwright tests. Static and browser-only: no accounts, no server.",
    "runsOn": "http://localhost:3006  (container \"web\", static files served)",
    "whatItIs": "LaunchHelp walks a beginner through thirteen phases of taking an idea to a\nlaunch: capture the idea, test the problem, scope the MVP, choose technology,\nmap screens, model data, define the API, plan implementation, design tests,\npackage with Docker/CI, pick hosting, launch safely and learn from use.\nEvery phase has a short lesson with sources, one interactive exercise, a\nsaved versioned artifact and a completion checklist; everything exports as\na project pack. It keeps assumptions apart from evidence and says plainly\nthat nothing has been tested or deployed for you. Projects are stored only in\nthe browser (backup from the Account page).",
    "notes": "",
    "howToRun": "From the mydocker dashboard: type \"launchhelp\" then \"up\", then \"open\".",
    "rawReadme": "LAUNCHHELP\n==========\nFolder:  projects/launchhelp\nType:    Interactive learning lab: from a product idea to a buildable plan\nStack:   React + Vite + TypeScript (single-page app, hash routes), Vitest,\n         Playwright tests. Static and browser-only: no accounts, no server.\nRuns on: http://localhost:3006  (container \"web\", static files served)\n\nWHAT IT IS\n----------\nLaunchHelp walks a beginner through thirteen phases of taking an idea to a\nlaunch: capture the idea, test the problem, scope the MVP, choose technology,\nmap screens, model data, define the API, plan implementation, design tests,\npackage with Docker/CI, pick hosting, launch safely and learn from use.\nEvery phase has a short lesson with sources, one interactive exercise, a\nsaved versioned artifact and a completion checklist; everything exports as\na project pack. It keeps assumptions apart from evidence and says plainly\nthat nothing has been tested or deployed for you. Projects are stored only in\nthe browser (backup from the Account page).\n\nFLOWS (screenshots in this folder)\n----------------------------------\n01-home.png         Home: \"Turn an idea into something you can build\", and\n                    three small concept demos you can try before reading.\n10-home-docker-demo.png\n                    The \"What does Docker actually do?\" demo: change the\n                    source, build the image, run it, stop the container.\n02-how-it-works.png What you decide, what LaunchHelp suggests, what changes\n                    upstream, and what it will not claim.\n03-curriculum.png   The curriculum with lesson previews per phase.\n04-examples.png     A finished example (community garden app): brief\n                    preview and the product pack it produced.\n05-lab.png          The technology lab: learn by changing the system.\n06-handbook.png     Handbook, Parts A to C: orientation, product, design.\n07-guides.png       Guides and the build-along (how to cut an MVP, where\n                    authorisation belongs).\n08-app-new.png      Start a project: \"What's your idea?\" with a live brief\n                    preview on the right.\n09-idea-typed.png   An idea typed in; the button changes from Skip to Next.\n11-first-question.png\n                    Phase 0 question 1 of 5, \"What problem do you notice?\",\n                    with an \"I don't know yet\" option that turns the gap\n                    into something to find out.\n\nHOW TO RUN\n----------\nFrom the mydocker dashboard: type \"launchhelp\" then \"up\", then \"open\".\n",
    "images": [
      {
        "src": "/docs/launchhelp/01-home.png",
        "filename": "01-home.png",
        "title": "Home",
        "caption": "Home: \"Turn an idea into something you can build\", and three small concept demos you can try before reading."
      },
      {
        "src": "/docs/launchhelp/02-how-it-works.png",
        "filename": "02-how-it-works.png",
        "title": "How it works",
        "caption": "What you decide, what LaunchHelp suggests, what changes upstream, and what it will not claim."
      },
      {
        "src": "/docs/launchhelp/03-curriculum.png",
        "filename": "03-curriculum.png",
        "title": "Curriculum",
        "caption": "The curriculum with lesson previews per phase."
      },
      {
        "src": "/docs/launchhelp/04-examples.png",
        "filename": "04-examples.png",
        "title": "Examples",
        "caption": "A finished example (community garden app): brief preview and the product pack it produced."
      },
      {
        "src": "/docs/launchhelp/05-lab.png",
        "filename": "05-lab.png",
        "title": "Lab",
        "caption": "The technology lab: learn by changing the system."
      },
      {
        "src": "/docs/launchhelp/06-handbook.png",
        "filename": "06-handbook.png",
        "title": "Handbook",
        "caption": "Handbook, Parts A to C: orientation, product, design."
      },
      {
        "src": "/docs/launchhelp/07-guides.png",
        "filename": "07-guides.png",
        "title": "Guides",
        "caption": "Guides and the build-along (how to cut an MVP, where authorisation belongs)."
      },
      {
        "src": "/docs/launchhelp/08-app-new.png",
        "filename": "08-app-new.png",
        "title": "App new",
        "caption": "Start a project: \"What's your idea?\" with a live brief preview on the right."
      },
      {
        "src": "/docs/launchhelp/09-idea-typed.png",
        "filename": "09-idea-typed.png",
        "title": "Idea typed",
        "caption": "An idea typed in; the button changes from Skip to Next."
      },
      {
        "src": "/docs/launchhelp/10-home-docker-demo.png",
        "filename": "10-home-docker-demo.png",
        "title": "Home docker demo",
        "caption": "The \"What does Docker actually do?\" demo: change the source, build the image, run it, stop the container."
      },
      {
        "src": "/docs/launchhelp/11-first-question.png",
        "filename": "11-first-question.png",
        "title": "First question",
        "caption": "Phase 0 question 1 of 5, \"What problem do you notice?\", with an \"I don't know yet\" option that turns the gap into something to find out."
      }
    ]
  },
  "ml-failure-lab": {
    "slug": "ml-failure-lab",
    "folder": "mlfailurelab",
    "title": "ML FAILURE LAB",
    "type": "Model-diagnostics web app (upload predictions, find where a classifier or regressor fails)",
    "stack": "Next.js web app, FastAPI (Python) API, background worker, PostgreSQL, MinIO (file storage), Mailpit (dev mail), MLflow integration",
    "runsOn": "web http://localhost:3004, API http://localhost:4003 (OpenAPI at /docs); Postgres 5007, MinIO 5008/5009, Mailpit 5010",
    "whatItIs": "\"Your model scored 91%. Find out who it fails.\" Upload a CSV or Parquet of\ntrue labels and predictions, map the columns, and it analyses the run in the\nbackground: class-level metrics, a clickable confusion matrix that opens the\nexact samples, calibration, automatic failure-slice discovery with bootstrap\nconfidence intervals and multiple-comparison control, a threshold simulator,\nrun-to-run comparison, drift monitoring, and an exportable report. It handles\nbinary, multiclass, multilabel and regression problems.",
    "notes": "",
    "howToRun": "From the mydocker dashboard: type \"mlfailurelab\" then \"up\", then \"open\".\nThe first start builds api, worker and web images.",
    "rawReadme": "ML FAILURE LAB\n==============\nFolder:  projects/mlfailurelab\nType:    Model-diagnostics web app (upload predictions, find where a\n         classifier or regressor fails)\nStack:   Next.js web app, FastAPI (Python) API, background worker, PostgreSQL,\n         MinIO (file storage), Mailpit (dev mail), MLflow integration\nRuns on: web http://localhost:3004, API http://localhost:4003 (OpenAPI at\n         /docs); Postgres 5007, MinIO 5008/5009, Mailpit 5010\n\nWHAT IT IS\n----------\n\"Your model scored 91%. Find out who it fails.\" Upload a CSV or Parquet of\ntrue labels and predictions, map the columns, and it analyses the run in the\nbackground: class-level metrics, a clickable confusion matrix that opens the\nexact samples, calibration, automatic failure-slice discovery with bootstrap\nconfidence intervals and multiple-comparison control, a threshold simulator,\nrun-to-run comparison, drift monitoring, and an exportable report. It handles\nbinary, multiclass, multilabel and regression problems.\n\nFLOWS (screenshots in this folder)\n----------------------------------\n01-home.png         Landing page.\n03-register.png     Create an account (name, email, password).\n02-login.png        Sign in.\n04-forgot-password.png\n                    Password reset by email link.\n04-projects-list.png\n                    Projects: each holds the files and analyses for one\n                    model. (A throwaway account and a project named \"Fraud\n                    model demo\" were created in the local database to take\n                    these screenshots.)\n05-upload.png       Upload: drop a CSV/Parquet or try a bundled demo\n                    (imbalanced fraud model, and others).\n06-column-mapping.png\n                    Choosing the demo reads the file (20,000 rows) and\n                    guesses what each column means: true label, predicted\n                    label, probabilities and metadata for slice discovery.\n07-file-check.png   \"Check my file\": validation with fixable, human-readable\n                    messages before analysis.\n08-run-overview.png Run overview after \"Analyze this model\": headline\n                    finding (recall is 3% for small transactions on accounts\n                    under about 20 days old, holding 66% of all false\n                    negatives), overall metrics (accuracy 97.9% but balanced\n                    accuracy 83.3%), which classes are missed, confidence\n                    check, and every finding ranked by severity.\n09-classes.png      Per-class precision, recall and support.\n10-confusion.png    Confusion matrix; each cell opens the samples behind it.\n11-calibration.png  Reliability diagram: the model is underconfident.\n12-failure-slices.png\n                    Automatically discovered weak segments with sample\n                    counts, confidence intervals and share of false\n                    negatives.\n13-threshold.png    Threshold simulator: move the decision threshold and see\n                    precision and recall trade off.\n14-report.png       The shareable report.\n\nHOW TO RUN\n----------\nFrom the mydocker dashboard: type \"mlfailurelab\" then \"up\", then \"open\".\nThe first start builds api, worker and web images.\n",
    "images": [
      {
        "src": "/docs/mlfailurelab/01-home.png",
        "filename": "01-home.png",
        "title": "Home",
        "caption": "Landing page."
      },
      {
        "src": "/docs/mlfailurelab/02-login.png",
        "filename": "02-login.png",
        "title": "Login",
        "caption": "Sign in."
      },
      {
        "src": "/docs/mlfailurelab/03-register.png",
        "filename": "03-register.png",
        "title": "Register",
        "caption": "Create an account (name, email, password)."
      },
      {
        "src": "/docs/mlfailurelab/04-forgot-password.png",
        "filename": "04-forgot-password.png",
        "title": "Forgot password",
        "caption": "Password reset by email link."
      },
      {
        "src": "/docs/mlfailurelab/04-projects-list.png",
        "filename": "04-projects-list.png",
        "title": "Projects list",
        "caption": "Projects: each holds the files and analyses for one model. (A throwaway account and a project named \"Fraud model demo\" were created in the local database to take these screenshots.)"
      },
      {
        "src": "/docs/mlfailurelab/05-upload.png",
        "filename": "05-upload.png",
        "title": "Upload",
        "caption": "Upload: drop a CSV/Parquet or try a bundled demo (imbalanced fraud model, and others)."
      },
      {
        "src": "/docs/mlfailurelab/06-column-mapping.png",
        "filename": "06-column-mapping.png",
        "title": "Column mapping",
        "caption": "Choosing the demo reads the file (20,000 rows) and guesses what each column means: true label, predicted label, probabilities and metadata for slice discovery."
      },
      {
        "src": "/docs/mlfailurelab/07-file-check.png",
        "filename": "07-file-check.png",
        "title": "File check",
        "caption": "\"Check my file\": validation with fixable, human-readable messages before analysis."
      },
      {
        "src": "/docs/mlfailurelab/08-run-overview.png",
        "filename": "08-run-overview.png",
        "title": "Run overview",
        "caption": "Run overview after \"Analyze this model\": headline finding (recall is 3% for small transactions on accounts under about 20 days old, holding 66% of all false negatives), overall metrics (accuracy 97.9% but balanced accuracy 83.3%), which classes are missed, confidence check, and every finding ranked by severity."
      },
      {
        "src": "/docs/mlfailurelab/09-classes.png",
        "filename": "09-classes.png",
        "title": "Classes",
        "caption": "Per-class precision, recall and support."
      },
      {
        "src": "/docs/mlfailurelab/10-confusion.png",
        "filename": "10-confusion.png",
        "title": "Confusion",
        "caption": "Confusion matrix; each cell opens the samples behind it."
      },
      {
        "src": "/docs/mlfailurelab/11-calibration.png",
        "filename": "11-calibration.png",
        "title": "Calibration",
        "caption": "Reliability diagram: the model is underconfident."
      },
      {
        "src": "/docs/mlfailurelab/12-failure-slices.png",
        "filename": "12-failure-slices.png",
        "title": "Failure slices",
        "caption": "Automatically discovered weak segments with sample counts, confidence intervals and share of false negatives."
      },
      {
        "src": "/docs/mlfailurelab/13-threshold.png",
        "filename": "13-threshold.png",
        "title": "Threshold",
        "caption": "Threshold simulator: move the decision threshold and see precision and recall trade off."
      },
      {
        "src": "/docs/mlfailurelab/14-report.png",
        "filename": "14-report.png",
        "title": "Report",
        "caption": "The shareable report."
      }
    ]
  },
  "mlforge": {
    "slug": "mlforge",
    "folder": "mlforge",
    "title": "MLFORGE",
    "type": "Interactive machine-learning engineering lab (teaching app)",
    "stack": "React + Vite + TypeScript. Every model is implemented from scratch in TypeScript (src/ml/); runs entirely in the browser, no backend.",
    "runsOn": "http://localhost:3008  (container \"web\", static files served)",
    "whatItIs": "\"Don't read about ML. Manipulate it.\" Seventy-five topics in ten tracks\n(foundations, maths and statistics, deep learning, LLMs, MLOps and more).\nEach topic follows the same loop: plain-words explanation, an interactive\nlab you can move, the maths, a pure-Python implementation, the NumPy\nversion, the scikit-learn / PyTorch version, a \"break it on purpose\" quiz,\nreal-world use cases, how it runs in production, and interview questions.\nCode cells are read-only; a guide shows how to run them on Colab or locally.\nProgress is tracked per lesson in the browser.",
    "notes": "",
    "howToRun": "From the mydocker dashboard: type \"mlforge\" then \"up\", then \"open\".",
    "rawReadme": "MLFORGE\n=======\nFolder:  projects/mlforge\nType:    Interactive machine-learning engineering lab (teaching app)\nStack:   React + Vite + TypeScript. Every model is implemented from scratch\n         in TypeScript (src/ml/); runs entirely in the browser, no backend.\nRuns on: http://localhost:3008  (container \"web\", static files served)\n\nWHAT IT IS\n----------\n\"Don't read about ML. Manipulate it.\" Seventy-five topics in ten tracks\n(foundations, maths and statistics, deep learning, LLMs, MLOps and more).\nEach topic follows the same loop: plain-words explanation, an interactive\nlab you can move, the maths, a pure-Python implementation, the NumPy\nversion, the scikit-learn / PyTorch version, a \"break it on purpose\" quiz,\nreal-world use cases, how it runs in production, and interview questions.\nCode cells are read-only; a guide shows how to run them on Colab or locally.\nProgress is tracked per lesson in the browser.\n\nFLOWS (screenshots in this folder)\n----------------------------------\n01-home.png        Landing page: \"Learn how machines learn from data\", what\n                   you will learn, and the roadmap.\n02-learn.png       The curriculum: ten tracks, 75 topics, learning paths.\n03-labs.png        All labs in one grid.\n04-projects.png    Twenty end-to-end projects and how one evolves (fraud\n                   detection example).\n05-interview.png   Interview prep in the same interactive style.\n06-progress.png    Your map: which lessons are complete.\n07-lesson-linear-regression.png\n                   A lesson page: sidebar sections (plain words, play with\n                   it, math, build it, break it, in the wild, interview).\n11-linear-regression-lab.png\n                   The linear-regression lab with its controls.\n08-lesson-neural-network.png\n12-neural-network-lab.png\n                   The neural-network playground: choose a dataset, set the\n                   hidden layers, and watch the decision surface and the\n                   loss curve update while it trains. Train and test\n                   accuracy are shown live.\n13-neural-network-spiral.png\n                   Switching the dataset to Spiral.\n09-lesson-kmeans.png   K-Means lesson.\n10-lesson-attention.png  Attention (Q, K, V) lesson.\n\nHOW TO RUN\n----------\nFrom the mydocker dashboard: type \"mlforge\" then \"up\", then \"open\".\n",
    "images": [
      {
        "src": "/docs/mlforge/01-home.png",
        "filename": "01-home.png",
        "title": "Home",
        "caption": "Landing page: \"Learn how machines learn from data\", what you will learn, and the roadmap."
      },
      {
        "src": "/docs/mlforge/02-learn.png",
        "filename": "02-learn.png",
        "title": "Learn",
        "caption": "The curriculum: ten tracks, 75 topics, learning paths."
      },
      {
        "src": "/docs/mlforge/03-labs.png",
        "filename": "03-labs.png",
        "title": "Labs",
        "caption": "All labs in one grid."
      },
      {
        "src": "/docs/mlforge/04-projects.png",
        "filename": "04-projects.png",
        "title": "Projects",
        "caption": "Twenty end-to-end projects and how one evolves (fraud detection example)."
      },
      {
        "src": "/docs/mlforge/05-interview.png",
        "filename": "05-interview.png",
        "title": "Interview",
        "caption": "Interview prep in the same interactive style."
      },
      {
        "src": "/docs/mlforge/06-progress.png",
        "filename": "06-progress.png",
        "title": "Progress",
        "caption": "Your map: which lessons are complete."
      },
      {
        "src": "/docs/mlforge/07-lesson-linear-regression.png",
        "filename": "07-lesson-linear-regression.png",
        "title": "Lesson linear regression",
        "caption": "A lesson page: sidebar sections (plain words, play with it, math, build it, break it, in the wild, interview)."
      },
      {
        "src": "/docs/mlforge/08-lesson-neural-network.png",
        "filename": "08-lesson-neural-network.png",
        "title": "Lesson neural network",
        "caption": "Lesson neural network"
      },
      {
        "src": "/docs/mlforge/09-lesson-kmeans.png",
        "filename": "09-lesson-kmeans.png",
        "title": "Lesson kmeans",
        "caption": "K-Means lesson."
      },
      {
        "src": "/docs/mlforge/10-lesson-attention.png",
        "filename": "10-lesson-attention.png",
        "title": "Lesson attention",
        "caption": "Attention (Q, K, V) lesson."
      },
      {
        "src": "/docs/mlforge/11-linear-regression-lab.png",
        "filename": "11-linear-regression-lab.png",
        "title": "Linear regression lab",
        "caption": "The linear-regression lab with its controls."
      },
      {
        "src": "/docs/mlforge/12-neural-network-lab.png",
        "filename": "12-neural-network-lab.png",
        "title": "Neural network lab",
        "caption": "The neural-network playground: choose a dataset, set the hidden layers, and watch the decision surface and the loss curve update while it trains. Train and test accuracy are shown live."
      },
      {
        "src": "/docs/mlforge/13-neural-network-spiral.png",
        "filename": "13-neural-network-spiral.png",
        "title": "Neural network spiral",
        "caption": "Switching the dataset to Spiral."
      }
    ]
  },
  "homesense-platform": {
    "slug": "homesense-platform",
    "folder": "mmsar",
    "title": "MMSAR / HOMESENSE",
    "type": "Multimodal smart-home activity-recognition platform: ML research code plus a full web product around it",
    "stack": "Python ML core (har_core: sequence, image, graph and text modalities fused into one classifier), FastAPI service, background worker, streaming services (windows, predictor, anomaly, shadow model, sink), MLflow, MinIO, PostgreSQL, React + TypeScript web app, Expo mobile app, a dev OpenID Connect provider",
    "runsOn": "web http://localhost:3005, API http://localhost:4004, inference 4005 and shadow inference 4006, MLflow 5011, idp 5012, MinIO 5013 (about fifteen containers)",
    "whatItIs": "A model that recognises human activity from smart-home sensor events on the\nCASAS datasets (Aruba, Milan, Cairo, Kyoto, Orange). Each window of sensor\nevents is turned into four views (a sequence, a behaviour image, a sensor\ngraph and a text description) and fused. Around it sits a product: houses\nwith floor plans and published sensor metadata, validated datasets, model\nregistry with lifecycle checks and shadow runs, batch prediction jobs, a\npredictions explorer, anomaly detection, a live simulator, and role-based\naccess through OpenID Connect.",
    "notes": "The web build expects the identity provider on localhost:9400 and the API on\nlocalhost:8000, and the API only allows the browser origin\nhttp://localhost:5173. The mydocker dashboard publishes them on 5012 and 4004\nand the site on 3005, so signing in through a plain browser fails until\nthose values are rebuilt or configured to match (build-time API/OIDC base\nURLs and CORS_ORIGINS=http://localhost:3005). To take these screenshots the\nbrowser's requests to 9400 and 8000 were redirected to 5012 and 4004 and the\nCORS headers added at the browser; the application itself was not changed.\nThe signed-in pages above show data that already existed in the local\ndatabase (five houses, eleven prediction jobs).",
    "howToRun": "From the mydocker dashboard: type \"mmsar\" then \"up\" (the first start builds\nmany images and takes several minutes), then \"open\".",
    "rawReadme": "MMSAR / HOMESENSE\n=================\nFolder:  projects/mmsar  (compose project name \"homesense\")\nType:    Multimodal smart-home activity-recognition platform: ML research\n         code plus a full web product around it\nStack:   Python ML core (har_core: sequence, image, graph and text\n         modalities fused into one classifier), FastAPI service, background\n         worker, streaming services (windows, predictor, anomaly, shadow\n         model, sink), MLflow, MinIO, PostgreSQL, React + TypeScript web app,\n         Expo mobile app, a dev OpenID Connect provider\nRuns on: web http://localhost:3005, API http://localhost:4004, inference\n         4005 and shadow inference 4006, MLflow 5011, idp 5012, MinIO 5013\n         (about fifteen containers)\n\nWHAT IT IS\n----------\nA model that recognises human activity from smart-home sensor events on the\nCASAS datasets (Aruba, Milan, Cairo, Kyoto, Orange). Each window of sensor\nevents is turned into four views (a sequence, a behaviour image, a sensor\ngraph and a text description) and fused. Around it sits a product: houses\nwith floor plans and published sensor metadata, validated datasets, model\nregistry with lifecycle checks and shadow runs, batch prediction jobs, a\npredictions explorer, anomaly detection, a live simulator, and role-based\naccess through OpenID Connect.\n\nFLOWS (screenshots in this folder)\n----------------------------------\n01-home.png         Landing/sign-in entry (\"Activity intelligence\n                    workspace\").\n02-sign-in-provider.png\n                    The sign-in page, which starts an OpenID Connect\n                    authorisation-code flow (PKCE).\n03-idp-login.png    The dev identity provider: choose a predefined user\n                    (admin, researcher, viewer) or a custom one and\n                    authorise. Roles decide what the app lets you do.\n04-dashboard.png    Operations overview: houses, datasets, models and\n                    prediction-job counts, and recent prediction jobs.\n05-houses.png       Houses: five published configurations with floor-plan\n                    size and version.\n14-house-detail.png One house: live view, floor-plan annotation, published\n                    configuration versions (checksum, sensors) and validity.\n06-datasets.png     Validated sensor-event collections pinned to published\n                    house metadata.\n07-models.png       Registered model artifacts matched to house versions.\n08-lifecycle.png    Model lifecycle: checks, shadow run and promotion.\n09-prediction-jobs.png\n                    Batch inference with compatible dataset and model pairs.\n10-predictions.png / 13-predictions-timeline.png\n                    Predictions explorer: the activity timeline coloured by\n                    predicted activity (opacity follows confidence), class\n                    distribution, the average per-modality signal (text,\n                    sequence, image, graph) and a window list with evidence.\n11-anomalies.png    Unusual patterns raised by the detectors.\n12-simulator.png    Scenarios replayed through the same pipeline as real\n                    sensors.\n\nNOTE ON PORTS (for whoever runs this through mydocker)\n------------------------------------------------------\nThe web build expects the identity provider on localhost:9400 and the API on\nlocalhost:8000, and the API only allows the browser origin\nhttp://localhost:5173. The mydocker dashboard publishes them on 5012 and 4004\nand the site on 3005, so signing in through a plain browser fails until\nthose values are rebuilt or configured to match (build-time API/OIDC base\nURLs and CORS_ORIGINS=http://localhost:3005). To take these screenshots the\nbrowser's requests to 9400 and 8000 were redirected to 5012 and 4004 and the\nCORS headers added at the browser; the application itself was not changed.\nThe signed-in pages above show data that already existed in the local\ndatabase (five houses, eleven prediction jobs).\n\nHOW TO RUN\n----------\nFrom the mydocker dashboard: type \"mmsar\" then \"up\" (the first start builds\nmany images and takes several minutes), then \"open\".\n",
    "images": [
      {
        "src": "/docs/mmsar/02-sign-in-provider.png",
        "filename": "02-sign-in-provider.png",
        "title": "Sign in provider",
        "caption": "The sign-in page, which starts an OpenID Connect authorisation-code flow (PKCE)."
      },
      {
        "src": "/docs/mmsar/03-idp-login.png",
        "filename": "03-idp-login.png",
        "title": "Idp login",
        "caption": "The dev identity provider: choose a predefined user (admin, researcher, viewer) or a custom one and authorise. Roles decide what the app lets you do."
      },
      {
        "src": "/docs/mmsar/04-dashboard.png",
        "filename": "04-dashboard.png",
        "title": "Dashboard",
        "caption": "Operations overview: houses, datasets, models and prediction-job counts, and recent prediction jobs."
      },
      {
        "src": "/docs/mmsar/05-houses.png",
        "filename": "05-houses.png",
        "title": "Houses",
        "caption": "Houses: five published configurations with floor-plan size and version."
      },
      {
        "src": "/docs/mmsar/06-datasets.png",
        "filename": "06-datasets.png",
        "title": "Datasets",
        "caption": "Validated sensor-event collections pinned to published house metadata."
      },
      {
        "src": "/docs/mmsar/07-models.png",
        "filename": "07-models.png",
        "title": "Models",
        "caption": "Registered model artifacts matched to house versions."
      },
      {
        "src": "/docs/mmsar/08-lifecycle.png",
        "filename": "08-lifecycle.png",
        "title": "Lifecycle",
        "caption": "Model lifecycle: checks, shadow run and promotion."
      },
      {
        "src": "/docs/mmsar/09-prediction-jobs.png",
        "filename": "09-prediction-jobs.png",
        "title": "Prediction jobs",
        "caption": "Batch inference with compatible dataset and model pairs."
      },
      {
        "src": "/docs/mmsar/10-predictions.png",
        "filename": "10-predictions.png",
        "title": "Predictions",
        "caption": "Predictions explorer: the activity timeline coloured by predicted activity (opacity follows confidence), class distribution, the average per-modality signal (text, sequence, image, graph) and a window list with evidence."
      },
      {
        "src": "/docs/mmsar/11-anomalies.png",
        "filename": "11-anomalies.png",
        "title": "Anomalies",
        "caption": "Unusual patterns raised by the detectors."
      },
      {
        "src": "/docs/mmsar/12-simulator.png",
        "filename": "12-simulator.png",
        "title": "Simulator",
        "caption": "Scenarios replayed through the same pipeline as real sensors."
      },
      {
        "src": "/docs/mmsar/13-predictions-timeline.png",
        "filename": "13-predictions-timeline.png",
        "title": "Predictions timeline",
        "caption": "Predictions explorer: the activity timeline coloured by predicted activity (opacity follows confidence), class distribution, the average per-modality signal (text, sequence, image, graph) and a window list with evidence."
      },
      {
        "src": "/docs/mmsar/14-house-detail.png",
        "filename": "14-house-detail.png",
        "title": "House detail",
        "caption": "One house: live view, floor-plan annotation, published configuration versions (checksum, sensors) and validity."
      }
    ]
  },
  "mydocker": {
    "slug": "mydocker",
    "folder": "mydocker",
    "title": "MYDOCKER",
    "type": "Local control panel: list, start, stop and open every project in the projects folder through Docker, from one place",
    "stack": "Next.js 16 (App Router), React 19, Tailwind 4, framer-motion, TypeScript, Vitest (about 330 tests); talks to the Docker CLI",
    "runsOn": "http://127.0.0.1:9000  (npm run serve; kept off the network on purpose, because it can start containers and end programs)",
    "whatItIs": "One dashboard for a folder full of projects. It discovers each project, reads\nits Docker Compose file, gives every service a port that never collides with\nanother project's (web 3000+, backend 4000+, everything else 5000+), and\nwrites that into the compose file and a generated override. You then run\neverything from a terminal-style prompt: type a project name, then up, open,\nlogs, stop, restart, down, rebuild, code, folder and so on. It never offers to\nstart every project at once, because building many stacks together can freeze\na machine; only one build runs at a time.\n\nSCREENSHOTS (1440 x 900; the machine's network address and folder paths are",
    "notes": "- Fixes hard-coded ports: \"adopt\" rewrites a compose file's published ports\n  to variables, and a generated override keeps it consistent.\n- Generates a Dockerfile and compose file for Node projects that have none.\n- \"open\" goes straight to the website in a new tab; \"open docs\" and\n  \"open api\" go to the Swagger page and the API root.\n- Tasks: a project can define named commands in dashboard.json, run with\n  \"run <task>\".\n- Housekeeping: \"disk\" shows Docker disk use, \"prune\" asks for confirmation\n  and never removes volumes.\n- Marks a project \"code changed since build\" when its source is newer than\n  its image, and rebuilds on the next up.",
    "howToRun": "npm install, then npm run serve (production, about 120 MB and stable) and\nopen http://127.0.0.1:9000. npm run dev works too but its memory grows with\nevery request, so use it only while changing the dashboard itself.",
    "rawReadme": "MYDOCKER\n========\nFolder:  myDocker (the app that launches everything else)\nType:    Local control panel: list, start, stop and open every project in the\n         projects folder through Docker, from one place\nStack:   Next.js 16 (App Router), React 19, Tailwind 4, framer-motion,\n         TypeScript, Vitest (about 330 tests); talks to the Docker CLI\nRuns on: http://127.0.0.1:9000  (npm run serve; kept off the network on\n         purpose, because it can start containers and end programs)\n\nWHAT IT IS\n----------\nOne dashboard for a folder full of projects. It discovers each project, reads\nits Docker Compose file, gives every service a port that never collides with\nanother project's (web 3000+, backend 4000+, everything else 5000+), and\nwrites that into the compose file and a generated override. You then run\neverything from a terminal-style prompt: type a project name, then up, open,\nlogs, stop, restart, down, rebuild, code, folder and so on. It never offers to\nstart every project at once, because building many stacks together can freeze\na machine; only one build runs at a time.\n\nSCREENSHOTS (1440 x 900; the machine's network address and folder paths are\nblurred)\n--------------------------------------------------------------------------\n01-overview-docker-active.png\n        The dashboard with Docker running: green \"docker up\" signal, system\n        widget (CPU, RAM, and what is using the memory), one tile per\n        project with its allocated ports, git branch and changes, and the\n        ports-in-use panel on the right.\n02-ports-map.png\n        The ports tab: every allocated port, which project and service owns\n        it, and any conflicts.\n03-ports-panel-all.png\n        The ports-in-use panel with the \"all\" filter: every program listening\n        on the machine. The filter chips (dev, docker, node, all) narrow it,\n        and a program that is not Docker, mydocker or the system can be\n        ended from here. A stray program on a project's port is flagged with\n        \"blocks <project>\".\n04-network-address-on.png\n        \"links use network address\": the widget links switch from localhost\n        to this machine's network address so a phone or another computer on\n        the same Wi-Fi can open a running project.\n05-add-project-dialog.png\n        Add project: clone from a Git URL (automatic), or copy a folder in\n        and follow the badge on its tile (generate docker, adopt).\n06-terminal-autocomplete.png\n        The terminal: typing \"ly\" ghost-completes \"lykan\"; Tab accepts it.\n07-project-selected-options.png\n        With a project selected, the hint line lists only the options valid\n        for its current state (open, logs, stop, restart, down, rebuild ...).\n08-up-streaming-docker-output.png\n        \"up\" printing the real docker compose output as it happens (build\n        steps, image exports, container start), then \"lykan: up finished\"\n        with the site address.\n09-project-running-green.png\n        The project tile has a green border and an \"up\" signal, shows its\n        memory, and appears nested under Docker Desktop in the memory\n        breakdown; its port shows in the ports panel as published by Docker.\n10-stop-output.png\n        \"stop\": the container is stopped (never removed), the tile returns to\n        its idle look.\n\nOTHER THINGS IT DOES (not shown above)\n--------------------------------------\n- Fixes hard-coded ports: \"adopt\" rewrites a compose file's published ports\n  to variables, and a generated override keeps it consistent.\n- Generates a Dockerfile and compose file for Node projects that have none.\n- \"open\" goes straight to the website in a new tab; \"open docs\" and\n  \"open api\" go to the Swagger page and the API root.\n- Tasks: a project can define named commands in dashboard.json, run with\n  \"run <task>\".\n- Housekeeping: \"disk\" shows Docker disk use, \"prune\" asks for confirmation\n  and never removes volumes.\n- Marks a project \"code changed since build\" when its source is newer than\n  its image, and rebuilds on the next up.\n\nHOW TO RUN\n----------\nnpm install, then npm run serve (production, about 120 MB and stable) and\nopen http://127.0.0.1:9000. npm run dev works too but its memory grows with\nevery request, so use it only while changing the dashboard itself.\n",
    "images": [
      {
        "src": "/docs/mydocker/01-overview-docker-active.png",
        "filename": "01-overview-docker-active.png",
        "title": "Overview docker active",
        "caption": "The dashboard with Docker running: green \"docker up\" signal, system widget (CPU, RAM, and what is using the memory), one tile per project with its allocated ports, git branch and changes, and the ports-in-use panel on the right."
      },
      {
        "src": "/docs/mydocker/02-ports-map.png",
        "filename": "02-ports-map.png",
        "title": "Ports map",
        "caption": "The ports tab: every allocated port, which project and service owns it, and any conflicts."
      },
      {
        "src": "/docs/mydocker/03-ports-panel-all.png",
        "filename": "03-ports-panel-all.png",
        "title": "Ports panel all",
        "caption": "The ports-in-use panel with the \"all\" filter: every program listening on the machine. The filter chips (dev, docker, node, all) narrow it, and a program that is not Docker, mydocker or the system can be ended from here. A stray program on a project's port is flagged with \"blocks <project>\"."
      },
      {
        "src": "/docs/mydocker/04-network-address-on.png",
        "filename": "04-network-address-on.png",
        "title": "Network address on",
        "caption": "\"links use network address\": the widget links switch from localhost to this machine's network address so a phone or another computer on the same Wi-Fi can open a running project."
      },
      {
        "src": "/docs/mydocker/05-add-project-dialog.png",
        "filename": "05-add-project-dialog.png",
        "title": "Add project dialog",
        "caption": "Add project: clone from a Git URL (automatic), or copy a folder in and follow the badge on its tile (generate docker, adopt)."
      },
      {
        "src": "/docs/mydocker/06-terminal-autocomplete.png",
        "filename": "06-terminal-autocomplete.png",
        "title": "Terminal autocomplete",
        "caption": "The terminal: typing \"ly\" ghost-completes \"lykan\"; Tab accepts it."
      },
      {
        "src": "/docs/mydocker/07-project-selected-options.png",
        "filename": "07-project-selected-options.png",
        "title": "Project selected options",
        "caption": "With a project selected, the hint line lists only the options valid for its current state (open, logs, stop, restart, down, rebuild ...)."
      },
      {
        "src": "/docs/mydocker/08-up-streaming-docker-output.png",
        "filename": "08-up-streaming-docker-output.png",
        "title": "Up streaming docker output",
        "caption": "\"up\" printing the real docker compose output as it happens (build steps, image exports, container start), then \"lykan: up finished\" with the site address."
      },
      {
        "src": "/docs/mydocker/09-project-running-green.png",
        "filename": "09-project-running-green.png",
        "title": "Project running green",
        "caption": "The project tile has a green border and an \"up\" signal, shows its memory, and appears nested under Docker Desktop in the memory breakdown; its port shows in the ports panel as published by Docker."
      },
      {
        "src": "/docs/mydocker/10-stop-output.png",
        "filename": "10-stop-output.png",
        "title": "Stop output",
        "caption": "\"stop\": the container is stopped (never removed), the tile returns to its idle look."
      }
    ]
  },
  "querydoctor": {
    "slug": "querydoctor",
    "folder": "query_doctor",
    "title": "QUERYDOCTOR",
    "type": "Evidence-based PostgreSQL and MongoDB performance investigator",
    "stack": "Next.js web app (React Flow plan viewer), FastAPI (Python) API with a worker, PostgreSQL 16 (sample, benchmark and metadata instances), MongoDB 7, Redis, a learned model that ranks index suggestions",
    "runsOn": "web http://localhost:3003, API http://localhost:4002 (OpenAPI at /docs); seven supporting containers (databases, redis, worker, seed)",
    "whatItIs": "Give it a slow SELECT (or a MongoDB find/aggregate). It reads the execution\nplan, finds the bottleneck, tests index ideas with the planner without\ncreating them, benchmarks the promising ones in an isolated copy of the data\nand recommends only what the measurements support. Every evidence level is\nlabelled: suggested, planner-validated (what-if test) or benchmark-validated\n(measured). Explanations are generated from measurements; nothing a language\nmodel writes can change an evidence level, and the analysed database is never\nmodified.",
    "notes": "",
    "howToRun": "From the mydocker dashboard: type \"query_doctor\" then \"up\" (it brings up the\nwhole stack, so the first start takes a few minutes), then \"open\".",
    "rawReadme": "QUERYDOCTOR\n===========\nFolder:  projects/query_doctor\nType:    Evidence-based PostgreSQL and MongoDB performance investigator\nStack:   Next.js web app (React Flow plan viewer), FastAPI (Python) API with\n         a worker, PostgreSQL 16 (sample, benchmark and metadata instances),\n         MongoDB 7, Redis, a learned model that ranks index suggestions\nRuns on: web http://localhost:3003, API http://localhost:4002 (OpenAPI at\n         /docs); seven supporting containers (databases, redis, worker, seed)\n\nWHAT IT IS\n----------\nGive it a slow SELECT (or a MongoDB find/aggregate). It reads the execution\nplan, finds the bottleneck, tests index ideas with the planner without\ncreating them, benchmarks the promising ones in an isolated copy of the data\nand recommends only what the measurements support. Every evidence level is\nlabelled: suggested, planner-validated (what-if test) or benchmark-validated\n(measured). Explanations are generated from measurements; nothing a language\nmodel writes can change an evidence level, and the analysed database is never\nmodified.\n\nFLOWS (screenshots in this folder)\n----------------------------------\n01-home.png         Home: \"Find out why a query is slow\", sample slow\n                    queries to try and recent analyses.\n02-analyses-new.png New analysis: choose PostgreSQL or MongoDB, paste SQL and\n                    parameters, pick Explain only or Execute with analysis,\n                    or start from one of eight deliberately slow samples.\n07-new-analysis-sample-selected.png\n                    Sample \"Recent orders for one customer\" loaded.\n08-analysis-result.png / 09-analysis-result-full.png\n                    The finished analysis: planning and execution time, the\n                    plan as a graph (Seq Scan on orders is the slowest step,\n                    93% of the time), the finding \"97.2% of visited rows were\n                    discarded\", and ranked index ideas with a predicted\n                    speed-up (about 20x) and the evidence level.\n10-benchmark-result-full.png\n                    Ticking the consent box and running the benchmark builds\n                    the index in an isolated copy and measures 7 runs on each\n                    side: 95.4% faster (median 6 ms to 0.26 ms), same output,\n                    chart of every run, index size and build time.\n03-workload.png     Workload: queries ranked by total time, panels and\n                    regressions; import statistics, generate demo traffic or\n                    simulate a regression.\n11-workload-demo-traffic.png\n                    After generating demo traffic.\n04-projects.png     History by query and all analyses.\n05-models.png       The recommendation model: what it predicts, how\n                    suggestions are ordered, how models compare, training\n                    data.\n06-settings.png     What QueryDoctor does to the database, privacy, and how\n                    to connect your own databases.\n\nHOW TO RUN\n----------\nFrom the mydocker dashboard: type \"query_doctor\" then \"up\" (it brings up the\nwhole stack, so the first start takes a few minutes), then \"open\".\n",
    "images": [
      {
        "src": "/docs/query_doctor/01-home.png",
        "filename": "01-home.png",
        "title": "Home",
        "caption": "Home: \"Find out why a query is slow\", sample slow queries to try and recent analyses."
      },
      {
        "src": "/docs/query_doctor/02-analyses-new.png",
        "filename": "02-analyses-new.png",
        "title": "Analyses new",
        "caption": "New analysis: choose PostgreSQL or MongoDB, paste SQL and parameters, pick Explain only or Execute with analysis, or start from one of eight deliberately slow samples."
      },
      {
        "src": "/docs/query_doctor/03-workload.png",
        "filename": "03-workload.png",
        "title": "Workload",
        "caption": "Workload: queries ranked by total time, panels and regressions; import statistics, generate demo traffic or simulate a regression."
      },
      {
        "src": "/docs/query_doctor/04-projects.png",
        "filename": "04-projects.png",
        "title": "Projects",
        "caption": "History by query and all analyses."
      },
      {
        "src": "/docs/query_doctor/05-models.png",
        "filename": "05-models.png",
        "title": "Models",
        "caption": "The recommendation model: what it predicts, how suggestions are ordered, how models compare, training data."
      },
      {
        "src": "/docs/query_doctor/06-settings.png",
        "filename": "06-settings.png",
        "title": "Settings",
        "caption": "What QueryDoctor does to the database, privacy, and how to connect your own databases."
      },
      {
        "src": "/docs/query_doctor/07-new-analysis-sample-selected.png",
        "filename": "07-new-analysis-sample-selected.png",
        "title": "New analysis sample selected",
        "caption": "Sample \"Recent orders for one customer\" loaded."
      },
      {
        "src": "/docs/query_doctor/08-analysis-result.png",
        "filename": "08-analysis-result.png",
        "title": "Analysis result",
        "caption": "The finished analysis: planning and execution time, the plan as a graph (Seq Scan on orders is the slowest step, 93% of the time), the finding \"97.2% of visited rows were discarded\", and ranked index ideas with a predicted speed-up (about 20x) and the evidence level."
      },
      {
        "src": "/docs/query_doctor/09-analysis-result-full.png",
        "filename": "09-analysis-result-full.png",
        "title": "Analysis result full",
        "caption": "The finished analysis: planning and execution time, the plan as a graph (Seq Scan on orders is the slowest step, 93% of the time), the finding \"97.2% of visited rows were discarded\", and ranked index ideas with a predicted speed-up (about 20x) and the evidence level."
      },
      {
        "src": "/docs/query_doctor/10-benchmark-result-full.png",
        "filename": "10-benchmark-result-full.png",
        "title": "Benchmark result full",
        "caption": "Ticking the consent box and running the benchmark builds the index in an isolated copy and measures 7 runs on each side: 95.4% faster (median 6 ms to 0.26 ms), same output, chart of every run, index size and build time."
      },
      {
        "src": "/docs/query_doctor/11-workload-demo-traffic.png",
        "filename": "11-workload-demo-traffic.png",
        "title": "Workload demo traffic",
        "caption": "After generating demo traffic."
      }
    ]
  },
  "systemforge": {
    "slug": "systemforge",
    "folder": "systemcraft",
    "title": "SYSTEMFORGE  (folder: systemcraft)",
    "type": "Interactive system-design laboratory (teaching app)",
    "stack": "Next.js monorepo (apps/web), deterministic discrete-event simulation engine (packages/engine, 549 tests), Docker Compose mini-systems",
    "runsOn": "http://localhost:3009  (container \"web\")",
    "whatItIs": "\"Instead of reading about caching, you flush the cache and watch the database\nfall over, then turn on request coalescing and watch it recover.\" Every topic\nfollows one loop: theory, manipulate, observe metrics, break it, compare\ntrade-offs. It ships forty system labs (each with overview, requirements,\nestimation, architecture, live demo, failures, scaling, observability,\nchallenges and interview tabs), about 107 scored challenges, a drag-and-drop\narchitecture canvas that can be run under load, a code playground, a\nstep-by-step URL-shortener sandbox, a capacity calculator, and three real\nmini-systems you can bring up with Docker Compose. Progress stays in the\nbrowser; nothing leaves the machine.",
    "notes": "",
    "howToRun": "From the mydocker dashboard: type \"systemcraft\" then \"up\", then \"open\".",
    "rawReadme": "SYSTEMFORGE  (folder: systemcraft)\n==================================\nFolder:  projects/systemcraft\nType:    Interactive system-design laboratory (teaching app)\nStack:   Next.js monorepo (apps/web), deterministic discrete-event simulation\n         engine (packages/engine, 549 tests), Docker Compose mini-systems\nRuns on: http://localhost:3009  (container \"web\")\n\nWHAT IT IS\n----------\n\"Instead of reading about caching, you flush the cache and watch the database\nfall over, then turn on request coalescing and watch it recover.\" Every topic\nfollows one loop: theory, manipulate, observe metrics, break it, compare\ntrade-offs. It ships forty system labs (each with overview, requirements,\nestimation, architecture, live demo, failures, scaling, observability,\nchallenges and interview tabs), about 107 scored challenges, a drag-and-drop\narchitecture canvas that can be run under load, a code playground, a\nstep-by-step URL-shortener sandbox, a capacity calculator, and three real\nmini-systems you can bring up with Docker Compose. Progress stays in the\nbrowser; nothing leaves the machine.\n\nFLOWS (screenshots in this folder)\n----------------------------------\n01-home.png        Landing: what you will learn and the roadmap.\n02-labs.png        Labs grouped by Fundamentals, Building Blocks and\n                   Distributed Systems.\n08-cache-lab.png   A concept lab (Caching): move the controls and watch hit\n                   rate and database load respond.\n03-systems.png     The forty system designs, grouped (core distributed,\n                   coordination and real-time, transactional and interactive).\n09-system-design.png\n                   One system (URL shortener) with its tabbed design.\n04-canvas.png      Architecture canvas, empty: palette of component types,\n                   undo/redo, auto-layout, save/load JSON.\n10-canvas-starter.png\n                   \"Naive starter\" loaded onto the canvas, ready to validate\n                   and run under load.\n07-sandbox.png     Sandbox \"URL shortener: grow it under load\": seven steps\n                   from launch to sharding.\n11-sandbox-add-cache.png\n                   Step 2 (Add a cache): Redis in front of Postgres with the\n                   bottleneck still on the API tier, plus estimated cost.\n05-playground.png  Code playground: eight exercises (LRU cache, token bucket,\n                   consistent-hash ring, base62 IDs, backoff with jitter,\n                   trie autocomplete, task pool, lease lock).\n12-playground-run-tests.png\n                   Running the tests against the starter code: \"0 of 8\n                   passed\" with each failing case named. Code runs in a\n                   sandboxed Web Worker with a 3-second timeout.\n06-minis.png       The three real mini-systems (Docker Compose).\n13-capacity-calculator.png\n                   Capacity calculator for back-of-envelope estimates.\n\nHOW TO RUN\n----------\nFrom the mydocker dashboard: type \"systemcraft\" then \"up\", then \"open\".\n",
    "images": [
      {
        "src": "/docs/systemcraft/01-home.png",
        "filename": "01-home.png",
        "title": "Home",
        "caption": "Landing: what you will learn and the roadmap."
      },
      {
        "src": "/docs/systemcraft/02-labs.png",
        "filename": "02-labs.png",
        "title": "Labs",
        "caption": "Labs grouped by Fundamentals, Building Blocks and Distributed Systems."
      },
      {
        "src": "/docs/systemcraft/03-systems.png",
        "filename": "03-systems.png",
        "title": "Systems",
        "caption": "The forty system designs, grouped (core distributed, coordination and real-time, transactional and interactive)."
      },
      {
        "src": "/docs/systemcraft/04-canvas.png",
        "filename": "04-canvas.png",
        "title": "Canvas",
        "caption": "Architecture canvas, empty: palette of component types, undo/redo, auto-layout, save/load JSON."
      },
      {
        "src": "/docs/systemcraft/05-playground.png",
        "filename": "05-playground.png",
        "title": "Playground",
        "caption": "Code playground: eight exercises (LRU cache, token bucket, consistent-hash ring, base62 IDs, backoff with jitter, trie autocomplete, task pool, lease lock)."
      },
      {
        "src": "/docs/systemcraft/06-minis.png",
        "filename": "06-minis.png",
        "title": "Minis",
        "caption": "The three real mini-systems (Docker Compose)."
      },
      {
        "src": "/docs/systemcraft/07-sandbox.png",
        "filename": "07-sandbox.png",
        "title": "Sandbox",
        "caption": "Sandbox \"URL shortener: grow it under load\": seven steps from launch to sharding."
      },
      {
        "src": "/docs/systemcraft/08-cache-lab.png",
        "filename": "08-cache-lab.png",
        "title": "Cache lab",
        "caption": "A concept lab (Caching): move the controls and watch hit rate and database load respond."
      },
      {
        "src": "/docs/systemcraft/09-system-design.png",
        "filename": "09-system-design.png",
        "title": "System design",
        "caption": "One system (URL shortener) with its tabbed design."
      },
      {
        "src": "/docs/systemcraft/10-canvas-starter.png",
        "filename": "10-canvas-starter.png",
        "title": "Canvas starter",
        "caption": "\"Naive starter\" loaded onto the canvas, ready to validate and run under load."
      },
      {
        "src": "/docs/systemcraft/11-sandbox-add-cache.png",
        "filename": "11-sandbox-add-cache.png",
        "title": "Sandbox add cache",
        "caption": "Step 2 (Add a cache): Redis in front of Postgres with the bottleneck still on the API tier, plus estimated cost."
      },
      {
        "src": "/docs/systemcraft/12-playground-run-tests.png",
        "filename": "12-playground-run-tests.png",
        "title": "Playground run tests",
        "caption": "Running the tests against the starter code: \"0 of 8 passed\" with each failing case named. Code runs in a sandboxed Web Worker with a 3-second timeout."
      },
      {
        "src": "/docs/systemcraft/13-capacity-calculator.png",
        "filename": "13-capacity-calculator.png",
        "title": "Capacity calculator",
        "caption": "Capacity calculator for back-of-envelope estimates."
      }
    ]
  },
  "ufc-fight-intel": {
    "slug": "ufc-fight-intel",
    "folder": "ufc_fight_intel",
    "title": "UFC FIGHT INTEL",
    "type": "Full-stack data and prediction web app",
    "stack": "Next.js 16 (App Router, TypeScript), MongoDB + Mongoose, Tailwind 4, Node scraper (cheerio), Python (pymongo, scikit-learn) for rankings, features and the win model",
    "runsOn": "http://localhost:3011  (container \"web\"; MongoDB is on the host)",
    "whatItIs": "Fight intelligence for UFC: a fight-card dashboard, a published win\nprobability for every upcoming bout with the factors behind it, official\nrankings per division, a head-to-head \"Style Duel\" with a round-by-round\nexplorer, a chronological backtest of the model, and a data assistant whose\nanswers come only from the database.",
    "notes": "",
    "howToRun": "From the mydocker dashboard: type \"ufc_fight_intel\" then \"up\", then \"open\".\nNeeds MongoDB on the host (the compose file points the container at\nhost.docker.internal:27017).",
    "rawReadme": "UFC FIGHT INTEL\n===============\nFolder:  projects/ufc_fight_intel  (the app lives in app/)\nType:    Full-stack data and prediction web app\nStack:   Next.js 16 (App Router, TypeScript), MongoDB + Mongoose, Tailwind 4,\n         Node scraper (cheerio), Python (pymongo, scikit-learn) for rankings,\n         features and the win model\nRuns on: http://localhost:3011  (container \"web\"; MongoDB is on the host)\n\nWHAT IT IS\n----------\nFight intelligence for UFC: a fight-card dashboard, a published win\nprobability for every upcoming bout with the factors behind it, official\nrankings per division, a head-to-head \"Style Duel\" with a round-by-round\nexplorer, a chronological backtest of the model, and a data assistant whose\nanswers come only from the database.\n\nDATA PIPELINE\n-------------\nufcstats.com -> scraper -> MongoDB -> features -> Elo + logistic model\n             -> Next.js pages, REST API and assistant\nRankings and photos come from ufc.com, full pro records from Sherdog. The\nscraper solves the site's proof-of-work challenge and rate-limits itself.\nIngestion is idempotent, so re-running never duplicates rows.\n\nPAGES AND FLOWS (screenshots in this folder)\n--------------------------------------------\n01-home.png        Home: next event card with predicted winners, pound-for-\n                   pound rankings, and the public prediction record.\n02-events.png      Events: upcoming and past cards.\n10-event-card.png  One event: every bout on the card with the model's pick.\n09-bout.png        One bout: the model's probability (33% vs 67%) next to an\n                   Elo baseline, a confidence label, the factors that moved\n                   it with their pre-fight values and impact, and a tale of\n                   the tape (record, age, height, reach).\n08-fighter.png     Fighter profile: record, physical stats and fight history.\n03-rankings.png    Rankings: men's pound-for-pound and every division.\n12-rankings-lightweight.png\n                   Switching the division tab to Lightweight.\n04-matchup.png     Style Duel: pick two fighters and compare styles, with the\n                   round-by-round explorer.\n05-predictions.png Prediction record: settled predictions and a chronological\n                   backtest against the Elo baseline (the settled list is\n                   empty until events complete after publication).\n06-assistant.png   Assistant: suggested questions and a free-text box.\n11-assistant-answer.png\n                   Asking \"Who is on the next card?\" returns the card with\n                   model probabilities, the data source and a link to the\n                   full card. If the data is not there it says so.\n07-methodology.png What is predicted, how results are treated, data sources\n                   and limits (estimates, not betting advice).\n\nHOW TO RUN\n----------\nFrom the mydocker dashboard: type \"ufc_fight_intel\" then \"up\", then \"open\".\nNeeds MongoDB on the host (the compose file points the container at\nhost.docker.internal:27017).\n",
    "images": [
      {
        "src": "/docs/ufc_fight_intel/01-home.png",
        "filename": "01-home.png",
        "title": "Home",
        "caption": "Home: next event card with predicted winners, pound-for- pound rankings, and the public prediction record."
      },
      {
        "src": "/docs/ufc_fight_intel/02-events.png",
        "filename": "02-events.png",
        "title": "Events",
        "caption": "Events: upcoming and past cards."
      },
      {
        "src": "/docs/ufc_fight_intel/03-rankings.png",
        "filename": "03-rankings.png",
        "title": "Rankings",
        "caption": "Rankings: men's pound-for-pound and every division."
      },
      {
        "src": "/docs/ufc_fight_intel/04-matchup.png",
        "filename": "04-matchup.png",
        "title": "Matchup",
        "caption": "Style Duel: pick two fighters and compare styles, with the round-by-round explorer."
      },
      {
        "src": "/docs/ufc_fight_intel/05-predictions.png",
        "filename": "05-predictions.png",
        "title": "Predictions",
        "caption": "Prediction record: settled predictions and a chronological backtest against the Elo baseline (the settled list is empty until events complete after publication)."
      },
      {
        "src": "/docs/ufc_fight_intel/06-assistant.png",
        "filename": "06-assistant.png",
        "title": "Assistant",
        "caption": "Assistant: suggested questions and a free-text box."
      },
      {
        "src": "/docs/ufc_fight_intel/07-methodology.png",
        "filename": "07-methodology.png",
        "title": "Methodology",
        "caption": "What is predicted, how results are treated, data sources and limits (estimates, not betting advice)."
      },
      {
        "src": "/docs/ufc_fight_intel/08-fighter.png",
        "filename": "08-fighter.png",
        "title": "Fighter",
        "caption": "Fighter profile: record, physical stats and fight history."
      },
      {
        "src": "/docs/ufc_fight_intel/09-bout.png",
        "filename": "09-bout.png",
        "title": "Bout",
        "caption": "One bout: the model's probability (33% vs 67%) next to an Elo baseline, a confidence label, the factors that moved it with their pre-fight values and impact, and a tale of the tape (record, age, height, reach)."
      },
      {
        "src": "/docs/ufc_fight_intel/10-event-card.png",
        "filename": "10-event-card.png",
        "title": "Event card",
        "caption": "One event: every bout on the card with the model's pick."
      },
      {
        "src": "/docs/ufc_fight_intel/11-assistant-answer.png",
        "filename": "11-assistant-answer.png",
        "title": "Assistant answer",
        "caption": "Asking \"Who is on the next card?\" returns the card with model probabilities, the data source and a link to the full card. If the data is not there it says so."
      },
      {
        "src": "/docs/ufc_fight_intel/12-rankings-lightweight.png",
        "filename": "12-rankings-lightweight.png",
        "title": "Rankings lightweight",
        "caption": "Switching the division tab to Lightweight."
      }
    ]
  }
};

export function getProjectDoc(slug: string): ProjectDoc | undefined {
  return projectDocs[slug];
}
