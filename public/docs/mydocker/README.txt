MYDOCKER
========
Folder:  myDocker (the app that launches everything else)
Type:    Local control panel: list, start, stop and open every project in the
         projects folder through Docker, from one place
Stack:   Next.js 16 (App Router), React 19, Tailwind 4, framer-motion,
         TypeScript, Vitest (about 330 tests); talks to the Docker CLI
Runs on: http://127.0.0.1:9000  (npm run serve; kept off the network on
         purpose, because it can start containers and end programs)

WHAT IT IS
----------
One dashboard for a folder full of projects. It discovers each project, reads
its Docker Compose file, gives every service a port that never collides with
another project's (web 3000+, backend 4000+, everything else 5000+), and
writes that into the compose file and a generated override. You then run
everything from a terminal-style prompt: type a project name, then up, open,
logs, stop, restart, down, rebuild, code, folder and so on. It never offers to
start every project at once, because building many stacks together can freeze
a machine; only one build runs at a time.

SCREENSHOTS (1440 x 900; the machine's network address and folder paths are
blurred)
--------------------------------------------------------------------------
01-overview-docker-active.png
        The dashboard with Docker running: green "docker up" signal, system
        widget (CPU, RAM, and what is using the memory), one tile per
        project with its allocated ports, git branch and changes, and the
        ports-in-use panel on the right.
02-ports-map.png
        The ports tab: every allocated port, which project and service owns
        it, and any conflicts.
03-ports-panel-all.png
        The ports-in-use panel with the "all" filter: every program listening
        on the machine. The filter chips (dev, docker, node, all) narrow it,
        and a program that is not Docker, mydocker or the system can be
        ended from here. A stray program on a project's port is flagged with
        "blocks <project>".
04-network-address-on.png
        "links use network address": the widget links switch from localhost
        to this machine's network address so a phone or another computer on
        the same Wi-Fi can open a running project.
05-add-project-dialog.png
        Add project: clone from a Git URL (automatic), or copy a folder in
        and follow the badge on its tile (generate docker, adopt).
06-terminal-autocomplete.png
        The terminal: typing "ly" ghost-completes "lykan"; Tab accepts it.
07-project-selected-options.png
        With a project selected, the hint line lists only the options valid
        for its current state (open, logs, stop, restart, down, rebuild ...).
08-up-streaming-docker-output.png
        "up" printing the real docker compose output as it happens (build
        steps, image exports, container start), then "lykan: up finished"
        with the site address.
09-project-running-green.png
        The project tile has a green border and an "up" signal, shows its
        memory, and appears nested under Docker Desktop in the memory
        breakdown; its port shows in the ports panel as published by Docker.
10-stop-output.png
        "stop": the container is stopped (never removed), the tile returns to
        its idle look.

OTHER THINGS IT DOES (not shown above)
--------------------------------------
- Fixes hard-coded ports: "adopt" rewrites a compose file's published ports
  to variables, and a generated override keeps it consistent.
- Generates a Dockerfile and compose file for Node projects that have none.
- "open" goes straight to the website in a new tab; "open docs" and
  "open api" go to the Swagger page and the API root.
- Tasks: a project can define named commands in dashboard.json, run with
  "run <task>".
- Housekeeping: "disk" shows Docker disk use, "prune" asks for confirmation
  and never removes volumes.
- Marks a project "code changed since build" when its source is newer than
  its image, and rebuilds on the next up.

HOW TO RUN
----------
npm install, then npm run serve (production, about 120 MB and stable) and
open http://127.0.0.1:9000. npm run dev works too but its memory grows with
every request, so use it only while changing the dashboard itself.
