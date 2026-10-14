SYSTEMFORGE  (folder: systemcraft)
==================================
Folder:  projects/systemcraft
Type:    Interactive system-design laboratory (teaching app)
Stack:   Next.js monorepo (apps/web), deterministic discrete-event simulation
         engine (packages/engine, 549 tests), Docker Compose mini-systems
Runs on: http://localhost:3009  (container "web")

WHAT IT IS
----------
"Instead of reading about caching, you flush the cache and watch the database
fall over, then turn on request coalescing and watch it recover." Every topic
follows one loop: theory, manipulate, observe metrics, break it, compare
trade-offs. It ships forty system labs (each with overview, requirements,
estimation, architecture, live demo, failures, scaling, observability,
challenges and interview tabs), about 107 scored challenges, a drag-and-drop
architecture canvas that can be run under load, a code playground, a
step-by-step URL-shortener sandbox, a capacity calculator, and three real
mini-systems you can bring up with Docker Compose. Progress stays in the
browser; nothing leaves the machine.

FLOWS (screenshots in this folder)
----------------------------------
01-home.png        Landing: what you will learn and the roadmap.
02-labs.png        Labs grouped by Fundamentals, Building Blocks and
                   Distributed Systems.
08-cache-lab.png   A concept lab (Caching): move the controls and watch hit
                   rate and database load respond.
03-systems.png     The forty system designs, grouped (core distributed,
                   coordination and real-time, transactional and interactive).
09-system-design.png
                   One system (URL shortener) with its tabbed design.
04-canvas.png      Architecture canvas, empty: palette of component types,
                   undo/redo, auto-layout, save/load JSON.
10-canvas-starter.png
                   "Naive starter" loaded onto the canvas, ready to validate
                   and run under load.
07-sandbox.png     Sandbox "URL shortener: grow it under load": seven steps
                   from launch to sharding.
11-sandbox-add-cache.png
                   Step 2 (Add a cache): Redis in front of Postgres with the
                   bottleneck still on the API tier, plus estimated cost.
05-playground.png  Code playground: eight exercises (LRU cache, token bucket,
                   consistent-hash ring, base62 IDs, backoff with jitter,
                   trie autocomplete, task pool, lease lock).
12-playground-run-tests.png
                   Running the tests against the starter code: "0 of 8
                   passed" with each failing case named. Code runs in a
                   sandboxed Web Worker with a 3-second timeout.
06-minis.png       The three real mini-systems (Docker Compose).
13-capacity-calculator.png
                   Capacity calculator for back-of-envelope estimates.

HOW TO RUN
----------
From the mydocker dashboard: type "systemcraft" then "up", then "open".
