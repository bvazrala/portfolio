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
  status: "Open to software engineering, data science, and machine learning internships." as string | null,
  email: "bvazrala@uci.edu",
  github: "bvazrala",
  linkedin: "https://www.linkedin.com/in/bala-kausik-vazrala-37869533/",
  resume: "/Resume.pdf",
  siteUrl: "https://bvazrala.vercel.app",

  headline: ["I love to build.", "Always ready to learn."],

  about: [
    "I came into college interested in almost everything, and spent a while trying to keep it that way. The economics degree was part of that. So was a stretch of taking whatever looked worth taking. Eventually I picked computer science, less because the other subjects stopped being interesting and more because you can't learn everything, and this was the one that let me actually build.",
    "The Intelligent Systems specialization was the same reasoning applied again. It was the material I found most interesting, and the one whose ideas travel furthest. Strip the abstraction off machine learning and you find statistics, calculus, and linear algebra used cleverly, which is the layer I've always liked working in. Taking a search engine apart in my information retrieval class did more for me than most of what I've built, because ranking and relevance and deciding what matters are questions that show up nowhere near search.",
    "What I care about now is the whole loop rather than any one part of it. Planning something, building it, seeing how it behaves, reading what the numbers say, talking to the people using it, then going again with better information. That's also what drew me to the business side, since it's where you find out whether the thing you built was worth building.",
    "So I'm not chasing a particular title. I'm looking for work where that loop runs, and where I get to keep being curious about how it all fits together.",
  ],

  focusAreas: [
    "Full-stack development",
    "Data science",
    "Machine learning",
    "Software engineering",
    "IoT & embedded systems",
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
  id: "rl-driving",
  title: "Yield",
  short: "RL driving",
  subtitle: "What safety costs in speed",
  repo: null,
  domain: "model",
  year: "2026",
  dates: "Summer 2026 · CS 175",
  status: "In progress",
  lead: "Training a family of driving agents that differ only in how much they are penalised for crashing, then measuring what each one trades away.",
  impact: [
    "Five reward settings, three seeds each",
    "200 held out episodes per agent",
    "Output is a speed versus collision tradeoff curve",
  ],
  bullets: [
    "Training DQN agents in highway-env, where surrounding traffic follows the Intelligent Driver and MOBIL models.",
    "Holding hyperparameters and step budget fixed so the reward specification is the only variable.",
    "Testing zero shot transfer to merge and roundabout scenarios the agents never trained on.",
  ],
  stack: ["Python", "PyTorch", "Stable-Baselines3", "Gymnasium", "highway-env"],
  tags: ["python", "ml", "rl"],
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
    repo: "https://github.com/eric-vo/signpc",
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
    detail: "Summer program — Artificial Intelligence and Semiconductors",
    dates: "Summer 2024",
  },
];

export const coursework = [
  {
    group: "AI & machine learning",
    items: [
      "CS 171: Artificial Intelligence",
      "CS 175: Project in AI",
      "CS 178: Machine Learning & Data Mining",
      "CS 179: Graphical Models",
      "SWE 119: AI Engineering Software",
    ],
  },
  {
    group: "Systems & data",
    items: [
      "CS 147: Internet of Things",
      "ICS 53: Principles in System Design",
      "CS 122A: Data Management",
      "CS 121: Information Retrieval",
    ],
  },
  {
    group: "Theory & math",
    items: [
      "CS 161: Design & Analysis of Algorithms",
      "CS 177: Applications of Probability",
      "STATS 67: Probability & Statistics",
      "Linear Algebra",
      "Discrete Mathematics",
      "Calculus",
    ],
  },
  {
    group: "Software engineering & HCI",
    items: [
      "IN4MATX 43: Software Engineering",
      "IN4MATX 131: Human Computer Interaction",
      "IN4MATX 133: User Interaction Software",
    ],
  },
  {
    group: "Business & Economics",
    items: [
      "Accounting",
      "Microeconomics",
      "Macroeconomics",
      "MGMT 105: Marketing",
      "MGMT 159: Analysis of Marketing Data",
      "MGMT 190: Consulting",
    ],
  },
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
  { id: "about", label: "About" },
  { id: "education", label: "Education" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
] as const;
