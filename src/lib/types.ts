/* ------------------------------------------------------------------ */
/*  Data Science Mastery — Domain Types                                 */
/*  Mirrors the Supabase/PostgreSQL schema (see supabase/schema.sql).   */
/* ------------------------------------------------------------------ */

export type Difficulty = "Beginner" | "Intermediate" | "Advanced";
export type ExerciseDifficulty = "Easy" | "Medium" | "Hard" | "Challenge";
export type LessonStatus = "locked" | "in_progress" | "completed";
export type LessonLanguage = "python" | "sql" | "r" | "javascript";

/* ---------- Step 1: Introduction ---------- */

export interface RealWorldApp {
  company: string;
  headline: string;
  detail: string;
}

export interface LessonIntro {
  hook: string; // one-paragraph welcome, instructor voice
  what: string;
  why: string;
  whereUsed: string;
  objectives: string[];
  realWorldApps: RealWorldApp[];
}

/* ---------- Step 2: Theory ---------- */

export type TheoryBlock =
  | { type: "text"; content: string }
  | { type: "analogy"; title: string; content: string }
  | { type: "keypoint"; title: string; content: string }
  | { type: "expandable"; title: string; content: string }
  | { type: "code-note"; code: string; content: string }
  | { type: "warning"; title: string; content: string };

/* ---------- Step 3: Visual Learning ---------- */

export interface DiagramNode {
  id: string;
  label: string;
  sublabel?: string;
  detail: string; // shown on hover / click-expand
  x: number; // 0-100 grid coords
  y: number;
  accent?: boolean;
}

export interface DiagramEdge {
  from: string;
  to: string;
  label?: string;
}

export interface LessonVisual {
  kind: "flow" | "comparison" | "decision-tree" | "architecture";
  title: string;
  caption: string;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
}

/* ---------- Step 4: Worked Examples ---------- */

export interface WorkedStep {
  code: string; // the line(s) revealed at this step
  explanation: string; // left-column narration for this step
}

export interface WorkedExample {
  difficulty: "Very Easy" | "Easy" | "Medium" | "Hard" | "Industry Example";
  title: string;
  scenario: string; // business/real context framing
  steps: WorkedStep[];
  output?: string;
}

/* ---------- Step 5: Hands-on Practice ---------- */

export interface InlineCoding {
  language: LessonLanguage;
  filename: string;
  instructions: string;
  starterCode: string;
  solutionCode: string;
  expectedOutput: string;
  hints: string[];
}

/* ---------- Step 6: Practice Exercises ---------- */

export type Exercise =
  | {
      type: "mcq";
      id: string;
      difficulty: ExerciseDifficulty;
      question: string;
      options: string[];
      correctIndex: number;
      explanation: string;
    }
  | {
      type: "coding";
      id: string;
      difficulty: ExerciseDifficulty;
      prompt: string;
      starterCode: string;
      solutionCode: string;
      expectedOutput: string;
      tests: { name: string; description: string }[];
    }
  | {
      type: "scenario";
      id: string;
      difficulty: ExerciseDifficulty;
      scenario: string; // business problem
      question: string;
      options: string[];
      correctIndex: number;
      explanation: string;
    };

/* ---------- Lesson / Module / Course ---------- */

export interface Lesson {
  id: string;
  slug: string;
  title: string;
  moduleSlug: string;
  courseSlug: string;
  estimatedTime: string;
  difficulty: Difficulty;
  prerequisites: { slug: string; title: string }[]; // links to prior lessons
  xpReward: number;
  step1Intro: LessonIntro;
  step2Theory: TheoryBlock[];
  step3Visual: LessonVisual;
  step4WorkedExamples: WorkedExample[];
  step5InlineCoding: InlineCoding;
  step6Exercises: Exercise[];
  interviewQuestions: { question: string; answer: string }[];
}

export interface Module {
  id: string;
  slug: string;
  courseSlug: string;
  title: string;
  description: string;
  orderIndex: number;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  estimatedHours: number;
  category: string; // roadmap section
  orderIndex: number;
  modules: Module[];
}

/* ---------- Projects ---------- */

export interface Project {
  id: string;
  slug: string;
  title: string;
  difficulty: "Mini" | "Intermediate" | "Advanced" | "Capstone";
  domain: "NLP" | "CV" | "Time Series" | "Tabular" | "MLOps" | "Analytics";
  summary: string;
  problemStatement: string;
  datasetUrl: string;
  datasetName: string;
  architecture: string[]; // pipeline stages
  steps: { title: string; detail: string }[];
  repoTree: string[]; // indented tree lines
  resumeDescription: string;
  estimatedHours: number;
  skills: string[];
}

/* ---------- Interview Prep ---------- */

export interface InterviewQuestion {
  id: string;
  company: string;
  topic: "SQL" | "Pandas" | "ML" | "Statistics" | "Python" | "System Design";
  difficulty: "Easy" | "Medium" | "Hard";
  title: string;
  question: string;
  language: LessonLanguage;
  starterCode: string;
  solutionCode: string;
  expectedOutput: string;
  testCases: { name: string; description: string }[];
}

/* ---------- Gamification ---------- */

export interface Achievement {
  slug: string;
  title: string;
  description: string;
  icon: string; // lucide icon name key
  xpReward: number;
}

/* ---------- Glossary (hover terms) ---------- */

export type Glossary = Record<string, string>;
