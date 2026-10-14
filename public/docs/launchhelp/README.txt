LAUNCHHELP
==========
Folder:  projects/launchhelp
Type:    Interactive learning lab: from a product idea to a buildable plan
Stack:   React + Vite + TypeScript (single-page app, hash routes), Vitest,
         Playwright tests. Static and browser-only: no accounts, no server.
Runs on: http://localhost:3006  (container "web", static files served)

WHAT IT IS
----------
LaunchHelp walks a beginner through thirteen phases of taking an idea to a
launch: capture the idea, test the problem, scope the MVP, choose technology,
map screens, model data, define the API, plan implementation, design tests,
package with Docker/CI, pick hosting, launch safely and learn from use.
Every phase has a short lesson with sources, one interactive exercise, a
saved versioned artifact and a completion checklist; everything exports as
a project pack. It keeps assumptions apart from evidence and says plainly
that nothing has been tested or deployed for you. Projects are stored only in
the browser (backup from the Account page).

FLOWS (screenshots in this folder)
----------------------------------
01-home.png         Home: "Turn an idea into something you can build", and
                    three small concept demos you can try before reading.
10-home-docker-demo.png
                    The "What does Docker actually do?" demo: change the
                    source, build the image, run it, stop the container.
02-how-it-works.png What you decide, what LaunchHelp suggests, what changes
                    upstream, and what it will not claim.
03-curriculum.png   The curriculum with lesson previews per phase.
04-examples.png     A finished example (community garden app): brief
                    preview and the product pack it produced.
05-lab.png          The technology lab: learn by changing the system.
06-handbook.png     Handbook, Parts A to C: orientation, product, design.
07-guides.png       Guides and the build-along (how to cut an MVP, where
                    authorisation belongs).
08-app-new.png      Start a project: "What's your idea?" with a live brief
                    preview on the right.
09-idea-typed.png   An idea typed in; the button changes from Skip to Next.
11-first-question.png
                    Phase 0 question 1 of 5, "What problem do you notice?",
                    with an "I don't know yet" option that turns the gap
                    into something to find out.

HOW TO RUN
----------
From the mydocker dashboard: type "launchhelp" then "up", then "open".
