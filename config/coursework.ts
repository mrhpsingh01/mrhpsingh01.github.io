export interface CourseProject {
  slug: string;
  title: string;
  summary: string;
  stack: string[];
  teamNote: string;
  contribution: string;
  period?: string;
  highlights: string[];
  howItWorks: string[];
  demoHeading?: string;
  demoTryThis?: string;
  honestyBadge?: string;
}

export interface CourseSubject {
  slug: string;
  name: string;
  shortName?: string;
  code?: string;
  blurb: string;
  focus: string;
  accent: string;
  projects: CourseProject[];
}

export const courseworkSubjects: CourseSubject[] = [
  {
    slug: "algorithms",
    name: "Algorithms",
    shortName: "Algorithms",
    blurb: "Dynamic programming and statistical models applied to biological sequences and optimization problems.",
    focus: "Hidden Markov models, Viterbi log-space decoding, and RNA secondary structure folding.",
    accent: "from-blue-500/20 to-indigo-500/10",
    projects: [
      {
        slug: "gene-finding-hmm",
        title: "Gene Finding with Hidden Markov Model",
        summary:
          "A two-state hidden Markov model that labels every base of a DNA sequence as background or gene, decoded with the Viterbi algorithm.",
        stack: ["Python", "NumPy", "Dynamic Programming", "HMM"],
        teamNote: "Graduate Course Project",
        contribution: "I implemented the statistical model, sequence generator, and Viterbi decoder in log space.",
        highlights: [
          "Two hidden states: uniform background vs. GC/AT-skewed gene emissions.",
          "Viterbi dynamic programming running in log-space to prevent numerical underflow on long sequences.",
          "Synthetic gene planter generator used to benchmark and verify decoding accuracy.",
        ],
        howItWorks: [
          "Maintains the optimal log-probability of ending in each state for every sequence position.",
          "Back-pointer table tracks maximum likelihood transitions, walked backwards to recover the state sequence.",
        ],
        demoHeading: "Viterbi Decoder & State Sequence",
        demoTryThis: "Adjust transition probability and observe the boundary sharpness of predicted gene regions.",
        honestyBadge: "Runs client-side statistical models on synthetic genomic sequences.",
      },
      {
        slug: "rna-folding",
        title: "RNA Secondary Structure Prediction",
        summary:
          "A dynamic-programming predictor that pairs RNA bases to maximise base-pair stability score, outputting structures in dot-bracket notation.",
        stack: ["Python", "Dynamic Programming", "Bioinformatics"],
        teamNote: "Graduate Course Project",
        contribution: "I implemented the scoring matrix, interval table fill, and recursive traceback.",
        highlights: [
          "Base pair scoring: A-U (2), C-G (3), and G-U wobble pair (1) with minimum loop constraint of 4 bases.",
          "Optimal substructure: for each substring, evaluate unpaired bases, end-pairs, or bifurcation splits.",
          "Full traceback reconstructing valid secondary structure dot-bracket strings.",
        ],
        howItWorks: [
          "Fills the dynamic programming table by increasing substring length so all subproblems are ready.",
          "Top-right cell holds the maximum global pairing score; traceback resolves the paired positions.",
        ],
        demoHeading: "Dynamic Table Fill & Traceback",
        demoTryThis: "Explore nested loop pairings and wobble base pairing validation.",
        honestyBadge: "Score-maximizing pairing algorithm based on classic Nussinov-style dynamic programming.",
      },
    ],
  },
  {
    slug: "computer-networks",
    name: "Computer networks",
    shortName: "Computer networks",
    blurb: "Low-level network engineering: packet crafting, custom protocol servers, TLS range downloads, and latency analysis.",
    focus: "UDP sockets, DNS wire-format parsing, DoH transport, OpenSSL multithreading, and network measurement.",
    accent: "from-emerald-500/20 to-teal-500/10",
    projects: [
      {
        slug: "dns-forwarder",
        title: "DNS Forwarder with Blocking & DoH",
        summary:
          "A DNS forwarder that intercepts queries, answers NXDOMAIN for blocklisted domains, and forwards legitimate requests via UDP or DNS-over-HTTPS.",
        stack: ["Python", "UDP Sockets", "Scapy", "DNS-over-HTTPS"],
        teamNote: "Course Project",
        contribution: "I wrote the forwarder in Python, and a companion C variant that parses DNS wire-format by hand.",
        highlights: [
          "Listens on UDP port 53, dissecting 12-byte DNS headers and length-prefixed domain labels.",
          "Synthesizes immediate NXDOMAIN packets for deny-list matches without touching upstream resolvers.",
          "RFC 8484 compliant base64url DNS-over-HTTPS upstream relay support.",
          "Real-time access audit logging with ALLOW/DENY decision records.",
        ],
        howItWorks: [
          "Inspects questions in the wire packet; forwards transparently or crafts an authoritative denial response.",
          "Encapsulates raw wire bytes into HTTPS payloads for encrypted DoH resolution.",
        ],
        demoHeading: "DNS Wire Dissector & Rule Engine",
        demoTryThis: "Query blocklisted domains vs allowed domains and inspect the raw binary response headers.",
        honestyBadge: "Compliant wire-format parsing with local simulated upstream resolver.",
      },
      {
        slug: "https-downloader",
        title: "Multi-threaded HTTPS Parallel Downloader",
        summary:
          "A robust C utility that queries file metadata via HEAD requests, splits files into parallel byte ranges, and reassembles segments over TLS.",
        stack: ["C", "POSIX Threads", "OpenSSL", "HTTP Range"],
        teamNote: "Course Project",
        contribution: "I built the multithreaded architecture, range request dispatcher, and segment stitcher in C.",
        highlights: [
          "Queries remote Content-Length using TLS HEAD requests, calculating chunk boundaries.",
          "Spawns POSIX worker threads per byte range with independent OpenSSL sessions.",
          "Per-part exponential retry handling (MAX_RETRIES = 3) with isolated disk writes.",
          "Atomic sequential file reassembly upon thread join completion.",
        ],
        howItWorks: [
          "Leverages HTTP Range headers ('bytes=start-end') to allow non-contiguous concurrent downloading.",
          "Independent segment files eliminate thread lock contention during high-speed transfers.",
        ],
        demoHeading: "Concurrent Range Assembly Simulator",
        demoTryThis: "Simulate random socket connection drops and observe chunk-level retries.",
        honestyBadge: "POSIX pthread and OpenSSL architecture verified against standard HTTP range servers.",
      },
      {
        slug: "latency-statistics",
        title: "Ping & Traceroute Diagnostic Suite",
        summary:
          "Automated network measurement tooling that captures latency distributions, parses multi-hop traceroutes, and computes per-hop statistical variance.",
        stack: ["Python", "ICMP", "Matplotlib", "Statistics"],
        teamNote: "Course Project",
        contribution: "I wrote both measurement tools, data parsing regexes, and statistical summarization.",
        highlights: [
          "Automated ping suite calculating mean, median, min, max, and jitter distributions.",
          "Multi-iteration traceroute parser grouping hop-by-hop latency samples to expose routing instability.",
          "Box-plot outlier detection revealing congested intermediate autonomous systems.",
        ],
        howItWorks: [
          "Extracts per-probe timestamps, groups latency metrics across iterations, and exports structured JSON.",
        ],
        demoHeading: "Hop-by-Hop Variance Visualizer",
        demoTryThis: "Analyze hop latency spreads to pinpoint where packet buffering occurs.",
        honestyBadge: "Parsed from real traceroute datasets collected across commercial network hops.",
      },
    ],
  },
  {
    slug: "distributed-computing",
    name: "Distributed Computing System",
    shortName: "Distributed Computing System",
    blurb: "Core distributed systems paradigms: concurrency control, message-passing protocols, persistent multicast, and hash rings.",
    focus: "TCP concurrency, ReadWriteLock synchronization, persistent stateful coordinators, and consistent hashing.",
    accent: "from-amber-500/20 to-orange-500/10",
    projects: [
      {
        slug: "simple-ftp",
        title: "Multi-threaded FTP Client & Server",
        summary:
          "A Java client and threaded server implementing a custom FTP protocol over TCP sockets with stateful working directory management.",
        stack: ["Java", "TCP Sockets", "Multithreading", "I/O"],
        teamNote: "Pair Project with Tejas D. Shinde",
        period: "Jan – Feb 2025",
        contribution: "We co-authored the threaded connection handler, stream protocol parser, and virtual file operations.",
        highlights: [
          "Concurrent client support via thread-per-connection pool with isolated session states.",
          "Framed length-prefixed stream transfer protocol for unambiguous EOF detection.",
          "Full command set: GET, PUT, LS, CD, MKDIR, PWD, and graceful QUIT.",
        ],
        howItWorks: [
          "Sends byte-count headers prior to raw payload transfer on streaming TCP sockets.",
        ],
        demoHeading: "Protocol Session & Command Trace",
        demoTryThis: "Step through connection handshake and stream transfers.",
        honestyBadge: "Faithful recreation of TCP protocol mechanics and socket session handling.",
      },
      {
        slug: "concurrent-ftp",
        title: "Concurrent FTP with Granular File Locks",
        summary:
          "An advanced FTP server featuring non-blocking background transfers, per-file ReadWriteLock concurrency, and an out-of-band terminate channel.",
        stack: ["Java", "ReadWriteLock", "ConcurrentMap", "Sockets"],
        teamNote: "Pair Project with Tejas D. Shinde",
        period: "Feb 2025",
        contribution: "I architected the per-file locking system, async transfer worker pool, and dual-port terminate interrupt.",
        highlights: [
          "Dual-port architecture: Port A handles data commands, Port B receives out-of-band terminate requests.",
          "Granular per-file ReadWriteLock: multiple concurrent readers permitted, writers get exclusive access.",
          "Asynchronous background task tracking with unique transfer task identifiers.",
          "Periodic chunk-level cancellation checks with automatic partial-file rollback.",
        ],
        howItWorks: [
          "Maintains lock tokens in a ConcurrentHashMap keyed by canonical file path.",
          "Secondary control port allows instant kill commands without head-of-line blocking.",
        ],
        demoHeading: "Concurrent Read/Write Lock Simulator",
        demoTryThis: "Queue multiple readers alongside a writer and watch read locks yield to the exclusive writer.",
        honestyBadge: "Recreates Java concurrent locking semantics and dual-socket command routing.",
      },
      {
        slug: "multicast",
        title: "Persistent Multicast with Time-Window Coordinator",
        summary:
          "A distributed group-communication protocol where a centralized coordinator buffers messages for offline members within a configurable time window.",
        stack: ["Java", "TCP Sockets", "Distributed Systems", "State Machines"],
        teamNote: "Individual Project",
        period: "Mar 2025",
        contribution: "I designed and implemented the coordinator state engine, participant protocol, and message time-to-live queues.",
        highlights: [
          "Dynamic group membership: register, deregister, temporary disconnect, and reconnect commands.",
          "Time-bounded message persistence (threshold td) ensuring offline participants catch up upon reconnection.",
          "Recipient snapshots captured at broadcast time to prevent retroactive leakage to late joiners.",
          "Audit event logging on every individual participant.",
        ],
        howItWorks: [
          "Coordinator records message recipients at the moment of send; buffers unexpired messages in memory.",
          "Reconnecting nodes receive buffered unexpired messages addressed to them.",
        ],
        demoHeading: "Distributed Group Messaging Simulator",
        demoTryThis: "Disconnect a node, broadcast messages, wait for TTL expiry, and observe selective catch-up.",
        honestyBadge: "Simulates time-window buffered multicast semantics and connection lifecycle events.",
      },
      {
        slug: "key-value-ring",
        title: "Consistent Hashing Distributed Key-Value Ring",
        summary:
          "A decentralized key-value storage service partitioned across a 1024-position consistent hash ring with dynamic node joining, graceful departures, and key handovers.",
        stack: ["Java", "Consistent Hashing", "TCP Sockets", "Ring Topology"],
        teamNote: "Individual Project",
        period: "Mar – Apr 2025",
        contribution: "I developed the bootstrap coordinator, ring routing logic, and dynamic key range migration.",
        highlights: [
          "1024-position logical ring where keys map to the nearest clockwise active node.",
          "Dynamic membership: new nodes claim key range (predecessor, id] with atomic handover.",
          "Graceful node departure: exiting node forwards stored pairs to its successor before sign-off.",
          "Request routing: query routing through bootstrap index with path tracing.",
        ],
        howItWorks: [
          "Ring partitioning confines membership churn to adjacent neighbor nodes.",
          "Key migrations occur only between the entering/exiting node and its immediate successor.",
        ],
        demoHeading: "Interactive 1024-Node Hash Ring",
        demoTryThis: "Insert keys, add node 434, exit node 650, and watch keys migrate smoothly between successor ranges.",
        honestyBadge: "Full consistent hashing ring algorithm verified across hundreds of join/leave cycles.",
      },
    ],
  },
  {
    slug: "database-systems",
    name: "Database Management System",
    shortName: "Database Management System",
    blurb: "Relational database schema modeling, role-based application workflows, and analytical SQL query engineering on PostgreSQL.",
    focus: "PostgreSQL 3NF schemas, role-based access control, CTEs, complex joins, and query plan optimization.",
    accent: "from-purple-500/20 to-pink-500/10",
    projects: [
      {
        slug: "property-management",
        title: "Enterprise Multi-Role Property Management",
        summary:
          "A comprehensive full-stack property management platform featuring four role-specific dashboards, lease agreement tracking, maintenance ticketing, and payment logs.",
        stack: ["PostgreSQL", "Drizzle ORM", "TypeScript", "Express", "Nuxt 3", "Vue 3"],
        teamNote: "Team of Three: Harmanpreet Singh, Dipendra Shrestha, Tejas D. Shinde",
        period: "Apr 2025",
        contribution:
          "I architected the frontend application, authentication flows, role-based access control (RBAC), and interactive dashboards.",
        highlights: [
          "Normalized PostgreSQL schema modeling tenants, owners, properties, leases, payments, and work orders.",
          "Role-based permission gating for Administrators, Property Managers, Property Owners, and Tenants.",
          "End-to-end maintenance ticketing lifecycle: Pending -> In-Progress -> Resolved.",
          "JWT session management and Drizzle ORM query optimizations.",
        ],
        howItWorks: [
          "Role context governs accessible data queries and mutation actions.",
          "Relational foreign keys bind tenant rental contracts directly to maintenance billing ledgers.",
        ],
        demoHeading: "RBAC Dashboard & Tenant Workflow",
        demoTryThis: "Switch between Tenant, Owner, and Manager roles to see dashboard capabilities adapt dynamically.",
        honestyBadge: "Production-grade database schema and multi-role UI recreation.",
      },
      {
        slug: "sql-job-postings",
        title: "38 SQL Exercises on PostgreSQL Analytics",
        summary:
          "A curriculum of 38 progressive SQL queries written for PostgreSQL over a normalized job-postings schema covering aggregation, windowing, subqueries, and CTEs.",
        stack: ["PostgreSQL", "SQL", "Relational Algebra", "CTEs", "Analytics"],
        teamNote: "Individual Practice & Curriculum",
        period: "Feb 2026",
        contribution: "I authored all thirty-eight analytical queries, edge-case fixes, and query plan notes.",
        highlights: [
          "Normalized star/snowflake schema: job_postings_fact, company_dim, skills_dim, and skills_job_dim.",
          "Complex aggregations: salary trends by skill combinations, remote posting ratios, and year-over-year demand.",
          "Advanced techniques: recursive Common Table Expressions (CTEs), CASE branching, and date-truncation grouping.",
          "Comparative query analysis highlighting index utilization and NULL handling nuances.",
        ],
        howItWorks: [
          "Bridges fact and dimension tables through associative link tables to model many-to-many skill requirements.",
          "CTEs modularize multi-pass aggregation for clear query plan evaluation.",
        ],
        demoHeading: "Analytical Query Catalog & Solutions",
        demoTryThis: "Browse queries from fundamental filtering to multi-level CTE aggregations.",
        honestyBadge: "PostgreSQL compliant queries authored and benchmarked against relational datasets.",
      },
    ],
  },
];
