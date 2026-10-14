RINGSIDE  (folder: dawgsss)
===========================
Folder:  projects/dawgsss
Type:    Real-time watch-party and sports-companion web app (plus an Expo
         mobile app in mobile/)
Stack:   React 18 + Vite, Node/Express server with Socket.IO, optional
         MongoDB (runs in local demo mode without it), Expo for Android
Runs on: http://localhost:3010  (container "web"; the server serves the
         built React app and the realtime API on one port)

WHAT IT IS
----------
A place for a household to watch sport together: a room per event with chat,
live reactions and polls, spoiler-safe delivery that delays messages to match
each viewer's stream offset, fantasy pick'ems, league tables, and a household
presence board. A live sports desk merges five public data providers into one
response (UFC rankings and events, F1 standings, football leagues, college
football, cricket), caches it for five minutes and reports provider health.
When the providers cannot be reached it falls back to saved snapshots, which
is the "Offline snapshots" badge in the header.

FLOWS (screenshots in this folder)
----------------------------------
First visit asks for a display name ("Join the house"); the name and points
stay attached to the browser profile.

01-home.png         Discover: hero with the next room, "your all-sports
                    rundown" cards (F1, football, college football, cricket),
                    league leaders for MMA, F1 and soccer, and the house chat
                    pulse.
02-watch-rooms.png  A live watch room (Holloway vs Poirier 3): event switcher
                    along the top, the fight stage with round and clock,
                    batched live reactions, a live poll ("Who wins this
                    round?"), and a side panel with room chat / Game yak.
                    Spoiler-safe delivery shows the stream offset slider and
                    delays chat accordingly.
03-create-event.png "Pick the next thing the house watches": event tiles per
                    sport with invited viewers, and Create an event.
04-upcoming.png     Upcoming fixtures across the sports.
05-pick.png         Fight card pick'em: choose three fighters within a budget
                    of 100 to build a lineup; tabs for MMA, F1, soccer,
                    college football and cricket.
06-standings.png    Standings tables per sport.
07-household.png    Household presence: who is home, away or maybe home,
                    inferred from door and motion events, never a camera.
08-recaps.png       Recaps tab. Observation: at the time of capture this tab
                    renders the same presence list as Household under a
                    "Fight night recaps" heading.

HOW TO RUN
----------
From the mydocker dashboard: type "dawgsss" then "up", then "open".
Without Docker: npm install && npm run build && npm start (port 3002), or
npm run dev for Vite on 5173.
