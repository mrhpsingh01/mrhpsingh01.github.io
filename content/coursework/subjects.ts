import type { CourseProject, Subject } from "./types";

/**
 * Sources: the coursework repositories (code, READMEs, project descriptions, git history).
 * Course codes and terms are not stated anywhere in them, so none are claimed. Team notes
 * come from commit history and READMEs.
 */

const geneFinder: CourseProject = {
  slug: "gene-finding-hmm",
  title: "Gene finding with a hidden Markov model",
  summary:
    "A two-state hidden Markov model that labels every base of a DNA sequence as background or gene, decoded with the Viterbi algorithm.",
  stack: ["Python", "NumPy", "Dynamic programming"],
  teamNote: "Course project",
  contribution: "I implemented the model, the sequence generator and the Viterbi decoder.",
  original: [
    "Two hidden states: background, where every base is equally likely, and gene, where A and G have probability alpha and C and T have probability beta, with 2(alpha + beta) = 1.",
    "A stay probability of 0.95 and a switch probability of 0.05 between states.",
    "Viterbi decoding in log space with a back-pointer table, then a backtrack to recover the labels.",
    "A generator that plants genes in a random sequence, so the decoded labels can be scored against the truth.",
  ],
  howItWorks: [
    "For each position the decoder keeps the best log-probability of ending in each state, from either staying or switching.",
    "Working in log space avoids numerical underflow on long sequences.",
    "The back-pointers record which state each best path came from, and the backtrack walks them from the end.",
  ],
  touches: [
    "Sliders for alpha, the switch probability, the sequence length and the seed.",
    "A heat map of the Viterbi table with the winning path highlighted, and a step-through slider.",
    "A box to decode your own DNA sequence.",
  ],
  notes: [
    "The planted genes use the same emission probabilities the decoder assumes, so accuracy here shows that the algorithm works, not that it would find real genes.",
    "As in my original, the first position starts from a 50/50 prior over the two states.",
  ],
  demo: {
    id: "hmm-gene-finder",
    heading: "Decode a DNA sequence",
    tryThis: "Make alpha larger, or the switch probability smaller, and watch the decoded gene regions sharpen.",
    honesty: "Runs entirely in your browser with a seeded random generator. Nothing is sent anywhere.",
  },
};

const rnaFolding: CourseProject = {
  slug: "rna-folding",
  title: "RNA secondary structure by dynamic programming",
  summary:
    "A dynamic-programming predictor that pairs RNA bases to maximise a base-pair score and prints the structure in dot-bracket notation.",
  stack: ["Python", "Dynamic programming"],
  teamNote: "Course project",
  contribution: "I implemented the scoring, the table fill and the traceback.",
  original: [
    "Pair scores A-U 2, C-G 3 and G-U 1, with a minimum distance of 4 between paired bases.",
    "For each substring: leave the last base unpaired, pair the two ends, or split the substring at some point k and add the two halves.",
    "A traceback that turns the table into a dot-bracket string such as ((...)).",
  ],
  howItWorks: [
    "The table is filled by substring length, so every cell only depends on shorter substrings that are already known.",
    "The value in the top-right cell is the best total pair score for the whole sequence.",
    "The traceback walks back from that cell, deciding at each step which of the three cases produced the value.",
  ],
  touches: [
    "A table view that fills in length by length, with a step slider.",
    "An arc diagram of the predicted pairs above the sequence.",
    "A switch between my original traceback and a corrected one, with a check that the structure's score equals the table's score.",
  ],
  notes: [
    "Revisiting the code for this demo I found two problems in the original: a duplicated A-U condition meant G-U pairs never scored, and the traceback trusted a pair flag that a later split could overwrite. The demo scores G-U as intended and recomputes the traceback from the table.",
    "The original traceback is still available in the demo so the mismatch can be seen on sequences where it happens.",
  ],
  demo: {
    id: "rna-folding",
    heading: "Fold a sequence",
    tryThis: "Press 'Find a sequence where the original traceback fails' to see the two traceback versions disagree.",
    honesty: "Runs entirely in your browser. The structure is a score-maximising pairing, not a physical energy model.",
  },
};

const dnsForwarder: CourseProject = {
  slug: "dns-forwarder",
  title: "DNS forwarder with domain blocking and DNS-over-HTTPS",
  summary:
    "A DNS forwarder that relays queries to an upstream resolver over UDP or DNS-over-HTTPS, answers NXDOMAIN for blocked domains and logs every query.",
  stack: ["Python", "UDP sockets", "scapy", "requests"],
  teamNote: "Course project",
  contribution: "I wrote the forwarder in Python, and a smaller C variant that parses the query by hand.",
  original: [
    "Listens on UDP port 53 and reads the queried name and type from each request.",
    "Domains in a deny-list file get a synthesised NXDOMAIN response. Everything else is forwarded.",
    "Forwarding goes either to an upstream server on UDP port 53 or to a DNS-over-HTTPS server.",
    "Every query is appended to a log as: domain, query type, ALLOW or DENY.",
  ],
  howItWorks: [
    "A DNS message is a 12-byte header followed by the question, with each name stored as length-prefixed labels.",
    "Blocking only needs the question, so the forwarder never has to understand upstream answers.",
    "For DoH the same message bytes travel inside an HTTPS request instead of a UDP datagram.",
  ],
  touches: [
    "A real DNS packet encoder and decoder, so the hex dumps are genuine wire-format messages.",
    "A step-by-step view of each query from client to forwarder to upstream and back.",
    "An editable deny list that starts with the one from the repository, and the log in the original format.",
  ],
  notes: [
    "The network is simulated. The upstream is a tiny synthetic zone using documentation address ranges, and no real DNS or HTTPS request is made.",
    "My original DoH call put the packet in the query string as hex. RFC 8484 specifies base64url, so the demo shows the compliant form.",
  ],
  demo: {
    id: "dns-forwarder",
    heading: "Send a query through the forwarder",
    tryThis: "Query yahoo.co.jp, which is on the deny list, then www.example.org, and compare the two packets and log lines.",
    honesty: "Real DNS message bytes, simulated network and upstream. Nothing leaves your browser.",
  },
};

const httpsDownloader: CourseProject = {
  slug: "https-downloader",
  title: "Multi-threaded HTTPS file downloader",
  summary:
    "A C program that asks a server for a file's size, downloads byte ranges in parallel threads over TLS, tries each part up to three times and reassembles the file.",
  stack: ["C", "POSIX threads", "OpenSSL", "HTTP range requests"],
  teamNote: "Course project",
  contribution: "I wrote the downloader in C.",
  original: [
    "Takes a URL, a number of parts and an output file name on the command line.",
    "Sends a HEAD request over TLS to read Content-Length, then splits the file into byte ranges.",
    "Runs one POSIX thread per range, each sending a range request and writing its own part file.",
    "Tries each part up to 3 times (MAX_RETRIES is 3), then joins the threads and concatenates the parts.",
  ],
  howItWorks: [
    "Each thread asks for bytes start-end with a Range header, so parts are independent and can arrive in any order.",
    "Writing each part to its own file avoids locking. Reassembly is a sequential concatenation at the end.",
    "A part that uses up its 3 attempts leaves a gap, and the reassembly step then stops with an error.",
  ],
  touches: [
    "A simulated server with adjustable bandwidth and a failure rate, so retries can be seen.",
    "Per-thread progress bars, the exact Range header each thread sends, and an event log.",
    "A comparison against a single connection on the same simulated server.",
  ],
  notes: [
    "Everything is simulated on a virtual clock. The speed-up shown is illustrative: real gains depend on the server, the network and whether the server limits connections.",
  ],
  demo: {
    id: "https-downloader",
    heading: "Download a file in parallel",
    tryThis: "Raise the failure rate to 40% and watch parts retry, then raise it further until one runs out of its 3 attempts.",
    honesty: "Simulated, with a virtual clock and a synthetic server. No real file is downloaded.",
  },
};

const latencyStats: CourseProject = {
  slug: "latency-statistics",
  title: "Ping and traceroute statistics",
  summary:
    "Two Python tools: one runs ping and summarises latency, the other runs traceroute repeatedly and reports per-hop statistics with box plots.",
  stack: ["Python", "ping and traceroute", "matplotlib", "JSON"],
  teamNote: "Course project",
  contribution: "I wrote both tools and the written conclusions.",
  original: [
    "pingstats runs ping with a delay and a packet count, parses the times and writes average, median, minimum and maximum to JSON, plus a box plot as a PDF.",
    "trstats runs traceroute several times, groups the latencies by hop, and writes per-hop statistics to JSON and a box plot per hop.",
    "A test mode reads saved traceroute output from files instead of running the command.",
  ],
  howItWorks: [
    "Regular expressions pull the hop number, host and latency out of each output line.",
    "Latencies are grouped by hop across runs, so each hop gets a distribution rather than a single number.",
    "A box plot shows the spread: a long box means variable latency, and dots beyond the whiskers are outliers.",
  ],
  touches: [
    "The five saved traces from my own connection are loaded in the browser and parsed by a port of the same logic.",
    "Box plots drawn from the data, the JSON the tool would write, and readouts that point at the hop with the highest median or widest spread.",
    "A box to paste your own traceroute or ping output.",
  ],
  notes: [
    "The five traces are real runs from my home connection to a Google address. Hops that did not answer are skipped, as in my parser.",
    "My original parser read only the first of the three probe times on each hop line. The demo reads all three, which gives each hop a better distribution.",
  ],
  demo: {
    id: "latency-stats",
    heading: "Explore the traces",
    tryThis: "Look for the hop where the box is widest, then paste in a traceroute of your own.",
    honesty: "Parses text in your browser. Nothing is sent anywhere, and no ping or traceroute is run.",
  },
};

const ftpSession: CourseProject = {
  slug: "simple-ftp",
  title: "Simple FTP client and server",
  summary:
    "A Java client and server that speak a small FTP-like protocol over TCP: get, put, delete, ls, cd, mkdir, pwd and quit.",
  stack: ["Java", "TCP sockets", "Threads"],
  teamNote: "Pair project with Tejas D. Shinde, as the repository's README states",
  contribution: "We wrote the client and the threaded server together.",
  period: "January to February 2025",
  original: [
    "The server listens on a port, accepts clients and handles each on its own thread, starting in the directory the server runs from.",
    "Commands travel as UTF strings. For get, the server replies OK and the file length, then the bytes. For put, the client sends the length, then the bytes.",
    "Errors such as a missing file or directory are returned as ERROR messages.",
  ],
  howItWorks: [
    "Sending the length before the bytes lets the receiver know exactly when the file ends on a stream socket.",
    "A thread per client means one slow transfer does not block other clients.",
    "Each client connection keeps its own current directory.",
  ],
  touches: [
    "A virtual file system on each side and a terminal that accepts the real command set.",
    "A live protocol trace showing the exact messages exchanged for each command.",
  ],
  notes: [
    "The demo simulates both sides in the browser. No sockets are opened and no real files are touched.",
  ],
  demo: {
    id: "ftp-session",
    heading: "Run an FTP session",
    tryThis: "Type ls, then get notes.txt, then put your own local file, and read the trace beside the terminal.",
    honesty: "A simulation of the protocol with virtual files, not a real network session.",
  },
};

const ftpConcurrent: CourseProject = {
  slug: "concurrent-ftp",
  title: "Concurrent FTP with locking and terminate",
  summary:
    "The FTP server extended with background transfers, a read-write lock per file so readers can overlap but a writer is exclusive, and a terminate command on a second port.",
  stack: ["Java", "TCP sockets", "ReadWriteLock", "Threads"],
  teamNote: "Pair project with Tejas D. Shinde, from the repository history",
  contribution: "We built the locking, the background transfers and the terminate path together.",
  period: "February 2025",
  original: [
    "The server listens on two ports: one for commands and one for terminate requests.",
    "A trailing & runs get or put in the background, and each command gets an ID.",
    "get takes a read lock on the file and put takes a write lock, so several readers can run together but a writer waits for everyone.",
    "terminate <id> sets a flag that the transfer checks every 1000 bytes, then stops and a partly written upload is removed.",
  ],
  howItWorks: [
    "Locks are kept per file name in a concurrent map, so unrelated files never wait on each other.",
    "A separate terminate port means a stop request is not stuck behind the command it wants to stop.",
    "Checking the flag between chunks makes a stop quick without needing to interrupt a blocking socket call.",
  ],
  touches: [
    "A timeline with one lane per command showing waiting, transferring, finished and terminated.",
    "A lock inspector for the shared file, and ready-made scenarios for readers, a writer and a terminate.",
  ],
  notes: [
    "The timeline simulates the locking rules on a virtual clock. It models the lock behaviour, not Java's thread scheduling.",
  ],
  demo: {
    id: "ftp-concurrent",
    heading: "Run concurrent transfers",
    tryThis: "Load the 'two readers and a writer' scenario and see the writer wait, then terminate the long reader.",
    honesty: "A discrete-event simulation of the lock rules, not a real server.",
  },
};

const multicast: CourseProject = {
  slug: "multicast",
  title: "Persistent multicast with a coordinator",
  summary:
    "A coordinator and several participants: participants register, disconnect and reconnect, and the coordinator keeps messages for a time threshold so those who were offline can still receive them.",
  stack: ["Java", "TCP sockets", "Threads"],
  teamNote: "Individual project, from the repository history",
  contribution: "I wrote the coordinator and the participant.",
  period: "March 2025",
  original: [
    "Participants send register, deregister, disconnect, reconnect and msend commands to the coordinator.",
    "A message goes to everyone registered when it was sent. Online participants receive it immediately.",
    "The coordinator keeps each message for td seconds. When a participant registers or reconnects, it sends any kept message still inside the window that the participant was a recipient of.",
    "Each participant appends what it receives to its own log file.",
  ],
  howItWorks: [
    "The set of recipients is fixed at send time, so someone who joins later does not receive older messages.",
    "Persistence is a time window, not a delivery guarantee: a message older than td is gone.",
    "Because the coordinator does not remember what it already delivered, it can send a kept message again on a later reconnect.",
  ],
  touches: [
    "Cards for the coordinator and three participants with the real command set, and a clock you can advance.",
    "A message history showing recipients, who has received what, and when each message expires.",
    "A switch between my original behaviour and a version that delivers each message at most once.",
  ],
  notes: [
    "Looking at the code again for the demo, I saw that a reconnecting participant can receive a message it already got, and that the participant does not filter repeats. The demo shows this in the original mode and fixes it in the other.",
  ],
  demo: {
    id: "multicast",
    heading: "Run a multicast group",
    tryThis: "Disconnect P2, send two messages, advance the clock past td, then reconnect P2.",
    honesty: "A simulation of the coordinator's rules with a virtual clock, not a networked system.",
  },
};

const kvRing: CourseProject = {
  slug: "key-value-ring",
  title: "Distributed key-value service on a hash ring",
  summary:
    "A bootstrap server and name servers share a ring of 1024 key positions. Servers enter and exit, key ranges move with them, and lookups, inserts and deletes are routed to the owner.",
  stack: ["Java", "TCP sockets", "Consistent hashing", "Threads"],
  teamNote: "Individual project, from the repository history",
  contribution: "I wrote the bootstrap server and the name server.",
  period: "March to April 2025",
  original: [
    "The bootstrap server has id 0, loads its initial key-value pairs from a config file and keeps the map of ring members.",
    "A key belongs to the first server at or after it on the ring, wrapping around past 1023.",
    "A name server joins by asking the bootstrap server, which hands over the pairs it holds in the new server's range (predecessor, id] and returns the predecessor and successor.",
    "A name server exits by sending all its pairs to the successor it was given, then telling the bootstrap server it left.",
    "lookup, insert and delete go through the bootstrap server, which forwards them to the owner and reports the path taken.",
  ],
  howItWorks: [
    "Ownership is a range on a circle, so a join or exit only moves one range.",
    "The bootstrap server is the only place that knows the whole ring.",
    "Pairs live in memory and are seeded from the config file. This is not persistent storage.",
  ],
  touches: [
    "The ring drawn with every key on it, animated key movement on join and exit, and the path of each request.",
    "The original config as a starting point, with the 35 fruit and vegetable keys.",
    "A switch that reproduces a stale-successor problem I found, and the corrected handover.",
  ],
  notes: [
    "Rereading the code for this demo I found two problems. First, a join only takes keys from the bootstrap server's own map, so a server that joins in front of another name server never receives the keys that server holds, and lookups for them fail. Second, a name server remembers the successor it had when it joined and never updates it, so if it exits after another server joined in between, it hands its keys to the wrong node.",
    "The demo runs both my original rules and a corrected version, and the unit tests check each: the corrected ring keeps every key reachable over hundreds of random joins and exits.",
    "There is no replication, and the bootstrap server is a single point of failure. This is a coursework design, not a fault-tolerant system.",
  ],
  demo: {
    id: "kv-ring",
    heading: "Join, exit and look up",
    tryThis: "Enter servers 434 and 650 and look up key 500. Then exit 434 and look up key 109, once with my original code and once with the corrected version.",
    honesty: "The ring logic runs in your browser with no network. It follows the rules of my Java code.",
  },
  relatedProject: { slug: "distributed-key-value-naming-service", label: "Read the earlier write-up of this project" },
};

const propertyManagement: CourseProject = {
  slug: "property-management",
  title: "Property management system",
  summary:
    "A web app for managing properties, tenants, owners, staff, rental agreements, payments and maintenance requests, with a different dashboard for each role.",
  stack: ["Nuxt 3", "Vue 3", "Nuxt UI", "TypeScript", "Express", "Drizzle ORM", "PostgreSQL"],
  teamNote: "Team of three: Dipendra Shrestha, Tejas D. Shinde and me, from the repositories' commit history",
  contribution:
    "I built most of the web frontend: the sign-in flow, the role-based dashboard, and the list, detail and create pages. Dipendra Shrestha wrote most of the API and database layer, and Tejas D. Shinde also contributed to the frontend.",
  period: "April 2025",
  original: [
    "A PostgreSQL schema for users, tenants, owners, employees, properties, rental agreements, payments and maintenance requests, with enums for roles, statuses and priorities.",
    "An Express API with JWT sign-in, Zod validation and Drizzle ORM queries.",
    "A Nuxt frontend whose dashboard shows different sections to admins, employees, owners and tenants.",
  ],
  howItWorks: [
    "Users have one of four roles, and the dashboard tiles are chosen from the role.",
    "Rental agreements link a tenant to a property, payments belong to an agreement, and maintenance requests link a tenant to a property.",
    "Maintenance requests move through pending, in progress, completed or cancelled.",
  ],
  touches: [
    "A browser re-creation of the frontend flows with seeded demo data and an in-memory store, so it runs without a server or database.",
    "A role switcher, so the role-based dashboard and permissions can be compared directly.",
    "Working forms for recording payments and filing and updating maintenance requests.",
  ],
  notes: [
    "This demo is a recreation of the screens and flows, not the original Nuxt code, and all people, properties and amounts are invented.",
    "The original frontend is Nuxt and Vue, which is also what the repository shows. An earlier version of this site described it differently, and that has been corrected.",
  ],
  demo: {
    id: "property-management",
    heading: "Switch roles and manage a portfolio",
    tryThis: "Sign in as the tenant, file a maintenance request, then switch to the employee and move it to in progress.",
    honesty: "An in-memory recreation with invented data. Nothing is saved after you leave.",
  },
  relatedProject: { slug: "property-management-system", label: "Read the earlier write-up" },
};

const sqlLab: CourseProject = {
  slug: "sql-job-postings",
  title: "SQL practice on a job-postings dataset",
  summary:
    "Thirty-eight SQL exercises written for PostgreSQL over job postings, companies and skills: filtering, aggregation, joins, dates, CASE, subqueries and CTEs.",
  stack: ["PostgreSQL", "SQL"],
  teamNote: "Individual practice",
  contribution: "I wrote the queries for each exercise.",
  period: "February 2026",
  original: [
    "A schema with company_dim, skills_dim, job_postings_fact and skills_job_dim.",
    "Exercises grouped from basic selects and filters to joins, aggregation, date handling, CASE and CTEs.",
    "Each exercise is a problem statement in a comment followed by the query I wrote.",
  ],
  howItWorks: [
    "The fact table holds one row per posting, and the dimension tables hold companies and skills.",
    "The skills table is linked through a bridge table because a posting can need many skills.",
    "Most queries are read-only. A few build new tables from query results.",
  ],
  touches: [
    "A real PostgreSQL engine compiled to WebAssembly, so the queries run exactly as written.",
    "A deterministic synthetic dataset with the same schema, because the original data is not in the repository.",
    "All the exercises in a browser grouped by topic, a free query editor, and review notes where I would now write a query differently.",
  ],
  notes: [
    "The dataset is synthetic. Results show how the queries behave, not facts about the job market.",
    "Some early exercises compare boolean columns with 1, which MySQL accepts and PostgreSQL rejects, and one has a trailing comma that PostgreSQL treats as a syntax error. The lab shows the real error and offers an adapted query.",
    "About ten queries do not answer their problem statement correctly. They are kept as written, with a review note and a corrected version.",
  ],
  demo: {
    id: "sql-lab",
    heading: "Run the exercises on PostgreSQL",
    tryThis: "Run the 'null' exercise, read the review note, then run the corrected version and compare.",
    honesty: "The database engine loads on request (about 6 MB, then cached) and runs in your browser. Nothing is sent anywhere.",
  },
};

export const subjects: Subject[] = [
  {
    slug: "algorithms",
    name: "Algorithms",
    blurb: "Dynamic programming applied to biological sequences.",
    focus: "Hidden Markov models, Viterbi decoding and sequence folding.",
    projects: [geneFinder, rnaFolding],
  },
  {
    slug: "computer-networks",
    name: "Computer networks",
    blurb: "Working directly with DNS messages, HTTPS range requests and network measurements.",
    focus: "UDP and TLS sockets, DNS wire format, parallel downloads and latency statistics.",
    projects: [dnsForwarder, httpsDownloader, latencyStats],
  },
  {
    slug: "distributed-computing",
    name: "Distributed Computing System",
    blurb: "Client-server protocols, concurrency control, group communication and consistent hashing.",
    focus: "TCP servers, locks, multicast with persistence and a hash ring.",
    projects: [ftpSession, ftpConcurrent, multicast, kvRing],
  },
  {
    slug: "database-systems",
    name: "Database Management System",
    blurb: "A relational design carried through to a working multi-role web application.",
    focus: "Schema design, role-based access and a full-stack application built as a team.",
    projects: [propertyManagement],
  },
  {
    slug: "sql",
    name: "SQL",
    blurb: "Analytical queries over a normalised job-postings dataset.",
    focus: "Joins, aggregation, dates, CASE, subqueries and CTEs on PostgreSQL.",
    projects: [sqlLab],
  },
];

export function getSubject(slug: string): Subject | undefined {
  return subjects.find((subject) => subject.slug === slug);
}
