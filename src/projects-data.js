// Single source of truth for site content.
// Privacy rule: no client, company or product brand names, no real data. Every image is a self-made
// illustration or mock screen with invented sample data.

export const site = {
  name: 'Shriyansh Saini',
  email: 'shriyanshsaini69@gmail.com',
  phone: '+91 82092 04604',
  phoneHref: 'tel:+918209204604',
  linkedin: 'https://www.linkedin.com/in/shriyansh-saini',
  github: 'https://github.com/SHRIYANSHMESSI',
  moreWork: 'https://github.com/SHRIYANSHMESSI',
  resume: '/resume.pdf',
  // Web3Forms access key, read from VITE_WEB3FORMS_KEY (.env locally, Netlify env var in production).
  web3formsKey: import.meta.env.VITE_WEB3FORMS_KEY || '',
  // Line 2 gets the pixel hover effect, keep it short.
  headline: ['Engineer', '& AI Builder'],
  subline: ['Shipping real apps for real users', 'now putting AI at the core of them'],
};

// Skill chips (label + lucide icon name). Icons must also be registered in icons.js.
export const skills = [
  { label: 'RAG Pipelines', icon: 'database' },
  { label: 'Python', icon: 'code' },
  { label: 'Flutter', icon: 'smartphone' },
  { label: 'Node.js', icon: 'server' },
  { label: 'React', icon: 'atom' },
  { label: 'Claude', icon: 'bot' },
  { label: 'Codex', icon: 'terminal' },
  { label: 'Antigravity', icon: 'sparkles' },
  { label: 'Offline-first', icon: 'wifi-off' },
  { label: 'Play Store', icon: 'rocket' },
];

// Projects. cover/hero: path under /public (img or .mp4/.webm/.mov). Leave null for a placeholder.
// Body blocks:
//   { type: 'heading' | 'text', content }
//   { type: 'media', src, alt, caption? }
//   { type: 'list', items: [string] }
//   { type: 'stats', items: [{ value, label }] }
//   { type: 'story', title, problem, fix, lesson? }
export const projects = [
  {
    slug: 'ai-assessment-engine',
    title: 'AI Assessment Engine',
    role: 'Software Engineer · Designed and built the AI microservice',
    description:
      'A RAG microservice that reads whole school textbooks and turns them into exam papers, quizzes and question banks that teachers can actually trust.',
    stack: ['Python', 'FastAPI', 'RAG', 'Postgres + pgvector', 'Valkey + RQ', 'Gemini / OpenAI', 'SymPy', 'Alembic', 'Pytest'],
    tint: '#F5F0FF',
    cover: '/images/projects/ai-assessment-engine/cover.svg',
    hero: '/images/projects/ai-assessment-engine/pipeline.svg',
    blocks: [
      { type: 'heading', content: 'The problem' },
      {
        type: 'text',
        content:
          'Writing a fair test by hand takes a teacher hours, and a school management platform wanted to take that work off their plate. Just asking a chatbot is not the answer: it makes up questions that are not in the syllabus, gets the marks wrong, and sometimes gets the answer key wrong, which is the worst failure of all because nobody notices until students are marked wrong.',
      },
      {
        type: 'text',
        content:
          'So the goal was different. Read the actual textbook the class uses, then generate papers from that book, and never trust the model on anything a computer can check.',
      },
      { type: 'heading', content: 'What I built' },
      {
        type: 'text',
        content:
          'I designed and built the AI service as its own Python microservice that plugs into the school app. It has two halves. The first reads a book: every page of a PDF goes through a vision model, which returns chapters, passages, worked examples, printed questions and maths as LaTeX. Those are chunked by the book’s own headings, not by token counts, and stored in Postgres with pgvector.',
      },
      {
        type: 'text',
        content:
          'The second half generates. A teacher picks a type (exam paper, class test, quiz, MCQ set, question bank or homework), the chapters and the difficulty. The service retrieves material chapter by chapter so a whole-book paper doesn’t quietly pull most of its questions from two chapters, writes each question slot against a blueprint, and then checks the result in code before anyone sees it.',
      },
      {
        type: 'media',
        src: '/images/projects/ai-assessment-engine/architecture.svg',
        alt: 'Architecture diagram: mobile and web apps call the school backend, which calls the AI service with a short-lived signed token. The AI service uses Postgres with pgvector, a job queue with workers, and swappable model providers.',
        caption: 'The apps never call the AI service directly. The school backend signs a short-lived token carrying who the user is and which school they belong to.',
      },
      { type: 'heading', content: 'What makes it trustworthy' },
      {
        type: 'list',
        items: [
          'The model never decides if a paper is correct. A validator in Python adds up the marks, checks chapter coverage, class level and MCQ keys, and sends failing slots back with the exact reason.',
          'Answer keys climb a ladder: numbers computed by code first, then maths solved with SymPy inside a sandbox, then the book’s own answer, and anything left is visibly marked unverified instead of guessed.',
          'Duplicates are caught by meaning and by numbers together, so "a 5 by 3 rectangle" and "a 7 by 4 rectangle" count as two real questions, not one repeat.',
          'A second test for the same class can’t repeat questions from the first one. Every route into a paper passes through one function that checks that.',
          'Each school’s books and questions are separated at the database level with row-level security, not just in the code.',
          'Model providers sit behind one adapter, so switching between Gemini and OpenAI is a config change, and a daily canary catches retired model ids before a school does.',
        ],
      },
      {
        type: 'media',
        src: '/images/projects/ai-assessment-engine/paper-mock.svg',
        alt: 'Mock screen with made-up content: a generated class test with five sample questions, each tagged with how its answer was checked, next to a panel of code checks and a difficulty mix bar.',
        caption: 'Mock screen with made-up content. Every question shows how its answer was checked.',
      },
      {
        type: 'stats',
        items: [
          { value: '1,600', label: 'Automated tests' },
          { value: '570', label: 'Pages in the biggest book read' },
          { value: '2', label: 'Languages: English and Hindi' },
          { value: '6', label: 'Things a teacher can generate' },
        ],
      },
      { type: 'heading', content: 'Problems I solved' },
      {
        type: 'story',
        title: 'The maths page that wouldn’t stop typing spaces',
        problem:
          'Three pages of a maths book kept failing as "response too long". It wasn’t a long page. The model was repeating one blank-space LaTeX command about 7,900 times, burning the whole 16,000-token budget on a page that normally costs under 800. A maths page is laid out in two dimensions, and blank space was the only tool the model had to copy that layout. Pressing retry just paid for the same loop again.',
        fix:
          'I told the prompt to copy the maths and not its layout, and put that in the live settings too, not only the default in code. I added a check that looks at what the reply is made of, so a stuck model is no longer mistaken for a long page. Retries now use a different prompt, and a page that’s truly stuck says so plainly. One of the pages now reads in under 700 tokens.',
      },
      {
        type: 'story',
        title: 'Every page said "done", but the book was read from test data',
        problem:
          'A real 311-page textbook came back marked complete: every page done, zero errors. Inside were 18 passages and 3 questions, and it had cost zero tokens. Several test runs had gone at the same time, and the test setup switched a shared setting to "use recorded fake responses" and then put it back. They raced each other, the setting got stuck on fake, and the next real book went through the whole pipeline on canned data.',
        fix:
          'Tests no longer write that setting at all. The fake mode is picked at the moment the setting is read, so parallel runs can’t leave anything behind. I switched the live setting back, cleared the fake content and read the book again for real.',
        lesson: 'What I took away: "done" tells you the process finished. It doesn’t tell you the result is right, so check what was actually produced.',
      },
      {
        type: 'media',
        src: '/images/projects/ai-assessment-engine/job-states.svg',
        alt: 'State machine diagram: pages move from pending to in progress to done. Temporary errors go to retry wait with backoff, permanent errors are recorded as failed, and a book with any failed page finishes as done with gaps.',
        caption: 'Each page keeps its own state and retry budget, so a book with a missing page reports "done with gaps", never just "done".',
      },
    ],
  },
  {
    slug: 'school-erp',
    title: 'School Operations App',
    role: 'Software Engineer · Built the mobile app',
    description:
      'A multi-tenant Flutter app that runs day-to-day school work across 30+ branches, and keeps working when the internet drops.',
    stack: ['Flutter', 'Riverpod', 'GoRouter', 'Drift / SQLite', 'Firebase Cloud Messaging', 'REST APIs', 'Hindi + English'],
    tint: '#F0F4FF',
    cover: '/images/projects/school-erp/cover.svg',
    hero: '/images/projects/school-erp/screens.svg',
    blocks: [
      { type: 'heading', content: 'The problem' },
      {
        type: 'text',
        content:
          'Schools across many branches needed one app for fees, attendance, homework, tests and parent updates. Teachers in rural areas lose their connection all the time, parents often have two or three children in the same school, and phones stay on old app versions for weeks after a new release.',
      },
      { type: 'heading', content: 'What I built' },
      {
        type: 'text',
        content:
          'I built the Flutter app, which has grown to 134 feature modules in a feature-first structure. It works offline first through Drift/SQLite and syncs when the network comes back. Every request is scoped by school, branch and session, so data never leaks between branches.',
      },
      {
        type: 'list',
        items: [
          'Attendance by tap, photo, face match or voice, saved offline and synced later.',
          'One parent login for the whole family. A notification about any child switches the app to that child before opening the right screen.',
          'Fee receipts made as PDFs on the phone itself, in Hindi and English.',
          'Fingerprint and OTP login with SMS auto-read.',
          'Old app versions stay safe: links a phone’s version doesn’t know open the inbox instead of a broken page, and the app only asks for an update when a newer build really exists.',
          'The teacher-facing screens for the AI Assessment Engine, from picking chapters to taking a quiz.',
        ],
      },
      {
        type: 'stats',
        items: [
          { value: '134', label: 'Feature modules' },
          { value: '105', label: 'Builds shipped' },
          { value: '30+', label: 'Branches' },
          { value: '2', label: 'Languages' },
        ],
      },
      { type: 'heading', content: 'Problems I solved' },
      {
        type: 'story',
        title: 'Opening the app silently turned off everyone else’s notifications',
        problem:
          'At one school, the owner got every notification but two colleagues got nothing. It looked random. The cause: every install sent the same hard-coded device id. The server reads "same device id, new user" as "someone else logged in on this phone" and turns off the old user’s notifications. Since every phone sent the same id, each time anyone opened the app, everyone else at the school was switched off.',
        fix:
          'The app now sends a real id that is unique to each install, kept in secure storage. The device id is required by the login calls, so the compiler catches a missed spot instead of production. On the server side, the rule now ignores shared placeholder ids, and duplicate push tokens are collapsed so no phone rings twice.',
      },
      {
        type: 'story',
        title: 'Random logouts "after some time"',
        problem:
          'Users kept getting logged out for no clear reason. When the access token expired, several screens failed at once and each tried to refresh the session by itself. The server throws an old refresh token away the moment it is used, so the second request sent a token that was already dead and the app logged the user out. A plain timeout during refresh was also being treated as a dead session.',
        fix:
          'I put every refresh behind one coordinator. It only asks the server to rotate if the stored token is the one the failed request used, and it checks again after every await. Only a real refusal from the server logs out. Timeouts and server errors keep the session. 14 unit tests cover the races, and I confirmed they catch the old bug by putting it back on purpose.',
      },
      {
        type: 'media',
        src: '/images/projects/school-erp/token-refresh.svg',
        alt: 'Diagram: five requests failing at once all go through one refresh coordinator; the outcome is refreshed, rejected by the server (the only case that logs out), or a temporary error that keeps the session.',
      },
    ],
  },
  {
    slug: 'cognitive-training',
    title: 'Cognitive Training Platform',
    role: 'Software Engineer · Built the admin dashboard, API and player app',
    description:
      'Timed brain-training games for participants and an admin dashboard for the team running the program, in clinical cognitive health.',
    stack: ['Flutter', 'React 18', 'Tailwind', 'Node.js', 'Express', 'Zod', 'JWT', 'MySQL'],
    tint: '#F0FFF4',
    cover: '/images/projects/cognitive-training/cover.svg',
    hero: '/images/projects/cognitive-training/dashboard.svg',
    blocks: [
      { type: 'heading', content: 'The problem' },
      {
        type: 'text',
        content:
          'A cognitive health program where timing really matters: reaction times are measured in milliseconds, and the people running it need to change game settings and pull clean data without asking a developer. The old PHP backend was hard to trust and hard to change.',
      },
      { type: 'heading', content: 'What I built' },
      {
        type: 'text',
        content:
          'I built both sides. Participants use a Flutter app to play 8 timed games from the clinical spec documents, such as N-back, Corsi blocks, Posner cueing and a stop-signal task, inside a 12-session program with reminders, Hindi support and demo walkthroughs. The team uses a React 18 and Tailwind dashboard to tune each game’s timings, follow progress and export reports.',
      },
      {
        type: 'text',
        content:
          'Behind both is one Node.js and Express API. I moved all 13 endpoints the app used off the old PHP backend and checked each one against the old responses, so already-installed apps kept working. Validation is done with Zod, auth with JWT, logs with Pino, and Excel and CSV exports strip participant names automatically.',
      },
      {
        type: 'media',
        src: '/images/projects/cognitive-training/architecture.svg',
        alt: 'Architecture diagram: the Flutter player app and the React admin dashboard both call one Node and Express API backed by MySQL; the old PHP backend is retired.',
      },
      { type: 'heading', content: 'Problems I solved' },
      {
        type: 'story',
        title: 'Hindi results disappeared without a trace',
        problem:
          'After one game started showing Hindi letters, participants who played in Hindi saw "results not saved", and nothing reached the dashboard. English worked fine. The table that stores every game result used an old character set that can’t hold Devanagari, so the whole submission was rejected, stars included.',
        fix:
          'I converted the table to utf8mb4 after checking that every existing row was plain text, so nothing could be lost. Then I confirmed a full Hindi result saves and reads back correctly, and shipped the same one-line migration for the live server.',
      },
      {
        type: 'story',
        title: 'Demos that looked perfect but made no sound',
        problem:
          'The in-app game demos played their animation but no narration, with no error anywhere. The permission that lets audio autoplay was being requested without waiting for it, right before the page loaded, so sometimes the page won the race. My tests had been switching off the browser’s autoplay rule the whole time, which is why they never caught it.',
        fix:
          'The app now waits for the permission before loading the demo. If the sound still doesn’t start, it retries once and then shows a Replay button, since a real tap is always allowed to play audio. It also logs a single line with the audio state so a silent demo can be diagnosed instead of guessed at.',
        lesson: 'What I took away: if a test removes a limit the real device has, it can’t find bugs caused by that limit.',
      },
    ],
  },
  {
    slug: 'mining-operations-app',
    title: 'Mining Operations App',
    role: 'Software Engineer · Built the mobile app',
    description:
      'A Flutter app for a mining royalty and weighbridge business: truck entries, stock, partners, cash and statements, on the owner’s phone.',
    stack: ['Flutter', 'Riverpod', 'GoRouter', 'Dio', 'PDF export', 'Role-based access'],
    tint: '#FFECDA',
    cover: '/images/projects/mining-operations-app/cover.svg',
    hero: '/images/projects/mining-operations-app/screens.svg',
    blocks: [
      { type: 'heading', content: 'The problem' },
      {
        type: 'text',
        content:
          'The business already had a working website and API, but the owner, partners and staff spend their day at the mine and the checkpost, not at a desk. They needed everything the website does, on a phone, with the same numbers down to the paisa.',
      },
      { type: 'heading', content: 'What I built' },
      {
        type: 'text',
        content:
          'I built the Flutter app from scratch on top of the existing REST API: weighbridge and checkpost entries, stock, partners and payouts, cash and bank, expenses, payroll, attendance, SMS, reports and statements that print or save as PDF. The menu and every action follow the same role and permission system as the website, and partners who belong to more than one company can switch between them.',
      },
      {
        type: 'list',
        items: [
          'One network layer handles login tokens, the company scope and the mine or checkpost side for every call, with tests for each trap.',
          'Money is always worked out by the server. The app shows a live preview that rounds exactly like the server, then the server’s figure is the one that’s saved.',
          'Released on the Play Store as signed app bundles.',
        ],
      },
      {
        type: 'media',
        src: '/images/projects/mining-operations-app/scopes.svg',
        alt: 'Diagram: the Flutter app talks to the existing REST API through one network layer that scopes every request by company (from the login token) and by business side (from a header); the server computes every money figure.',
      },
      { type: 'heading', content: 'Problems I solved' },
      {
        type: 'story',
        title: 'Every partner dropdown in the app was empty',
        problem:
          'On the website, the stock form showed three partners. In the app, the same form showed none, and that blocked every stock entry and payment. The partner’s share percentage comes from the database as text ("25.50"), not a number. The app treated it as a number, the parse threw, and one bad row emptied the entire list. Nothing showed an error, it was just empty.',
        fix:
          'I replaced the hard cast with a safe parser that accepts numbers or text and falls back to zero, the same pattern the money fields already used, and added a test for it. An earlier fix had only patched one screen, so this time I fixed it where the data is parsed, which fixed every picker at once.',
      },
      {
        type: 'story',
        title: 'Building the main entry form without copying the wrong rules',
        problem:
          'The weighbridge entry is the core action of the business, with over 20 fields, rate rules, payment splits and a live price. A similar checkpost form already existed in the app, and the easy move was to copy it. But the server’s validator for weighbridge entries refuses the money fields the checkpost form sends, so a copy would have been rejected.',
        fix:
          'I read the server’s validator first and treated it as the contract. The new form sends only the inputs and lets the server work out every amount. The on-screen preview is a pure, unit-tested function that rounds to the paisa like the server does.',
      },
    ],
  },
];
