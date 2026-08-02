/* ============================================================================
 * Everything on the site that isn't pulled from GitHub lives here.
 * Edit this file, commit, and Vercel redeploys. No other file needs touching.
 * ==========================================================================*/

export type DomainKey = "model" | "device" | "interface" | "practice";

export const DOMAINS: Record<DomainKey, { label: string; cssVar: string }> = {
  model: { label: "Models & data", cssVar: "--c-model" },
  device: { label: "Devices & systems", cssVar: "--c-device" },
  interface: { label: "Interfaces & tools", cssVar: "--c-interface" },
  practice: { label: "Practice", cssVar: "--c-practice" },
};

export const profile = {
  name: "Bala Kausik Vazrala",
  role: "Computer Science, UC Irvine",
  /* The line beside the green dot. Reword it or set it to null to hide it. */
  status: "Open to software and machine learning internships." as string | null,
  location: "Irvine, CA",
  email: "bvazrala@uci.edu",
  github: "bvazrala",
  linkedin: "https://linkedin.com/in/bala-kausik-vazrala",
  resume: "/Resume.pdf",
  siteUrl: "https://bvazrala.vercel.app",

  headline: ["I build systems that", "turn noise into signal."],

  intro:
    "An alarm clock that briefs you without handing you a phone. A model that finds five personality traits hiding in fifty survey questions. A webcam that types from hand signs.",

  about: [
    "I'm a junior at UC Irvine studying computer science, and most of what I build sits between a sensor and a decision — firmware that has to keep working when the network doesn't, models that have to explain themselves, interfaces that have to feel obvious.",
    "I transferred in from Irvine Valley College, where I ran the CS club and grew it from 700 to 900 members by teaching the things classes skipped: Git, the command line, how a network actually moves a packet. That's still the work I like best — taking something opaque and making it usable by someone who didn't build it.",
    "Right now I'm leading a two-person team on an ESP32 briefing device, mentoring incoming transfer students at UCI's Transfer Center, and reading more than I probably should about graphical models.",
  ],

  focusAreas: [
    "Embedded systems",
    "Probabilistic models",
    "Computer vision",
    "Data pipelines",
    "Developer tooling",
  ],
};

/* -------------------------------------------------------------------------- */

export type Project = {
  id: string;
  title: string;
  /* Short label used on the graph node. Keep it under ~16 characters. */
  short: string;
  subtitle: string;
  /* Links this entry to a GitHub repo so it isn't listed twice. */
  repo: string | null;
  demo?: { label: string; href: string };
  domain: DomainKey;
  year: string;
  dates: string;
  status?: string;
  lead: string;
  impact: string[];
  bullets: string[];
  stack: string[];
  tags: string[];
};

export const projects: Project[] = [
  {
    id: "briefly",
    title: "Briefly",
    short: "Briefly",
    subtitle: "IoT AI briefing station",
    repo: null,
    domain: "device",
    year: "2026",
    dates: "Jun 2026 — present",
    status: "In progress",
    lead: "An ESP32 device that reads you the morning without handing you a phone. Leading a team of two.",
    impact: [
      "Alarms keep firing through a network outage",
      "Summaries run on a local model — nothing leaves the house",
      "Device telemetry charted live in Azure IoT Hub",
    ],
    bullets: [
      "Wrote C++ firmware around FreeRTOS tasks so the alarm keeps its own time when Wi-Fi drops.",
      "Built a Python MQTT gateway that summarises feeds with a local LLM, keeping personal data on the home network.",
      "Streamed device telemetry to Azure IoT Hub to chart usage patterns on a live dashboard.",
    ],
    stack: ["C++", "FreeRTOS", "Python", "MQTT", "Azure IoT Hub", "ESP32"],
    tags: ["cpp", "embedded", "python", "cloud"],
  },
  {
    id: "big5",
    title: "Big Five graphical models",
    short: "Big Five graph",
    subtitle: "Structure learning over personality data",
    repo: "graphical_models_big5",
    domain: "model",
    year: "2026",
    dates: "Jun 2026 · CS 179",
    lead: "Fifty survey questions go in. Five personality traits come out — without the model being told what to look for.",
    impact: [
      "1.00 adjusted Rand index against the known five traits",
      "64.5% → 77.6% accuracy predicting masked answers",
    ],
    bullets: [
      "Fit a pairwise Ising model with L1 regularisation over 50 items from the openpsychometrics Big Five dataset.",
      "Ran community detection on the learned graph, recovering all five traits exactly.",
      "Predicted masked responses from each question's graph neighbourhood, beating the baseline by 13 points.",
    ],
    stack: ["Python", "scikit-learn", "NumPy", "Matplotlib"],
    tags: ["python", "ml", "graphs"],
  },
  {
    id: "asl",
    title: "ASL computer control",
    short: "ASL control",
    subtitle: "Typing and media control from hand signs",
    repo: null,
    domain: "interface",
    year: "2026",
    dates: "Apr 2026 · LA Hacks",
    lead: "Type and drive media playback with hand signs alone. No keyboard, no mouse.",
    impact: ["97% typing accuracy across the testing round"],
    bullets: [
      "Built the interface and media controls so users can type and run playback entirely by hand sign.",
      "Tuned detection for the letter pairs that get confused most, then led the testing that put accuracy at 97%.",
      "Prototyped a Gemma integration so the tool could take commands in plain language.",
    ],
    stack: ["Python", "OpenCV", "MediaPipe", "Gemma"],
    tags: ["python", "ml", "vision"],
  },
  {
    id: "tweets",
    title: "Tweet sentiment & emoji prediction",
    short: "Tweet sentiment",
    subtitle: "UCI Datathon 2026",
    repo: "uci_datathon_2026_project",
    domain: "model",
    year: "2026",
    dates: "Apr 2026 · UCI Datathon",
    lead: "A BERT classifier that reads sentiment from tweets and guesses the emoji, built with a team of four.",
    impact: ["Public dashboard so anyone can check the model instead of trusting our numbers"],
    bullets: [
      "Fine-tuned BERT to classify tweet sentiment and predict emoji labels.",
      "Shipped a Streamlit dashboard to explore predictions live.",
    ],
    stack: ["Python", "BERT", "Streamlit"],
    tags: ["python", "ml", "web"],
  },
];

/* -------------------------------------------------------------------------- */

export type Role = {
  title: string;
  org: string;
  href?: string;
  location: string;
  dates: string;
  bullets: string[];
};

export const experience: Role[] = [
  {
    title: "Transfer Center Peer Educator",
    org: "University of California, Irvine",
    location: "Irvine, CA",
    dates: "Jun 2026 — Present",
    bullets: [
      "Mentor 70+ assigned incoming transfer students through scheduled meetings that get them answers while the answers still matter.",
      "Analyse attendance data in Excel and Sheets to plan events, since turnout is what keeps the center funded.",
      "Match students to resources that fit their situation rather than handing out the same list.",
    ],
  },
  {
    title: "Computer Science Club President",
    org: "Irvine Valley College",
    location: "Irvine, CA",
    dates: "Aug 2024 — May 2025",
    bullets: [
      "Grew active membership close to 30%, from 700+ to 900+, by widening outreach and running more events.",
      "Organised 20+ sessions on Git, the command line, and network protocols — the things classes skipped.",
      "Recruited professors to speak and put club funds into socials, so events built something people came back to.",
    ],
  },
  {
    title: "Student Ambassador",
    org: "Intel Corporation",
    location: "Irvine, CA",
    dates: "Aug 2024 — May 2025",
    bullets: [
      "Ran workshops walking peers through OpenVINO and oneAPI on their own projects.",
    ],
  },
];

export const education = [
  {
    school: "University of California, Irvine",
    detail: "B.S. Computer Science, minor in Business Management · Honors Program · GPA 3.5",
    dates: "Expected Jun 2027",
  },
  {
    school: "Irvine Valley College",
    detail: "A.S. Economics · GPA 3.92",
    dates: "Jun 2022 — May 2025",
  },
  {
    school: "USC Viterbi School of Engineering",
    detail: "Summer program — artificial intelligence and semiconductors",
    dates: "Summer 2024",
  },
];

export const coursework = [
  "Data Structures",
  "Algorithms",
  "Machine Learning & Data Mining",
  "Artificial Intelligence",
  "Information Retrieval",
  "Data Management",
  "Software Engineering",
  "Probability & Statistics",
  "Linear Algebra",
];

export const skills: { group: string; items: string[] }[] = [
  {
    group: "Languages",
    items: ["Python", "Java", "C / C++", "TypeScript", "JavaScript", "SQL", "R", "HTML / CSS"],
  },
  {
    group: "ML & data",
    items: ["PyTorch", "scikit-learn", "OpenCV", "pandas", "NumPy", "Matplotlib", "Jupyter", "Streamlit"],
  },
  {
    group: "Frameworks & APIs",
    items: ["React", "Next.js", "Django", "Flask", "FastAPI", "REST", "OpenAI API", "Anthropic API"],
  },
  {
    group: "Data stores",
    items: ["PostgreSQL", "MySQL", "SQLite", "Firebase", "Tableau"],
  },
  {
    group: "Tools & cloud",
    items: ["Docker", "Git", "GitHub Actions", "pytest", "MQTT", "AWS", "Azure", "Vercel"],
  },
];

/* -------------------------------------------------------------------------- */

export const sections = [
  { id: "intro", label: "Intro" },
  { id: "about", label: "About" },
  { id: "work", label: "Work" },
  { id: "repositories", label: "Repositories" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
] as const;

/* Repos that shouldn't appear anywhere on the site. */
export const HIDDEN_REPOS = ["bvazrala", "bvazrala.github.io", "portfolio"];

/* Optional polish for a repo. Anything not listed still shows up using its
   GitHub description and language, so new pushes need no edit here. */
export const REPO_NOTES: Record<
  string,
  { title?: string; short?: string; description?: string; domain?: DomainKey; tags?: string[] }
> = {
  graphical_models_big5: {
    title: "Big Five graphical models",
    short: "Big Five graph",
    description:
      "A pairwise Ising model fit over 50 personality survey items; community detection on the learned graph recovers all five traits.",
    domain: "model",
    tags: ["python", "ml", "graphs"],
  },
  "CS-147-Class-Activities": {
    title: "CS 147 — IoT coursework",
    short: "CS 147 IoT",
    description: "Every lab from UCI's Internet of Things course: ESP32 firmware, sensors, and radios.",
    domain: "device",
    tags: ["cpp", "embedded"],
  },
  uci_datathon_2026_project: {
    title: "Tweet sentiment & emoji prediction",
    short: "Tweet sentiment",
    description: "BERT classifier for tweet sentiment with a public Streamlit dashboard. Built at UCI Datathon 2026.",
    domain: "model",
    tags: ["python", "ml", "web"],
  },
  mukya: {
    title: "Mukya",
    short: "Mukya",
    domain: "interface",
    tags: ["web", "js"],
  },
  perplexity_stock_pitch_comp: {
    title: "Stock pitch, with receipts",
    short: "Stock pitch",
    description: "Prompts, code, dashboard, and video from a Perplexity stock-pitch competition.",
    domain: "model",
    tags: ["web", "js", "data"],
  },
  wine_quality_ml_project: {
    title: "Wine quality regression",
    short: "Wine quality",
    description: "Predicting wine quality scores from physicochemical measurements.",
    domain: "model",
    tags: ["python", "ml"],
  },
  cs171_sudokuProject: {
    title: "Sudoku solver",
    short: "Sudoku solver",
    description: "Constraint propagation and backtracking search for CS 171's Sudoku assignment.",
    domain: "model",
    tags: ["python", "ai"],
  },
  "neetcode-submissions": {
    title: "NeetCode submissions",
    short: "NeetCode",
    description: "Problems I've worked through, committed as I go.",
    domain: "practice",
    tags: ["algorithms"],
  },
};
