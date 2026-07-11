import type { LessonLanguage } from "./types";

/* ------------------------------------------------------------------ */
/*  Mock code execution.                                               */
/*  Real deployments swap this for a sandboxed runner (Pyodide /       */
/*  Supabase Edge Function). The heuristics below make the inline      */
/*  editor feel alive: solution-matching, print extraction, and        */
/*  basic error simulation.                                            */
/* ------------------------------------------------------------------ */

export interface RunResult {
  stdout: string;
  stderr: string;
  durationMs: number;
  matchedExpected: boolean;
}

const normalize = (code: string) =>
  code
    .replace(/#.*$/gm, "")
    .replace(/--.*$/gm, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

function extractPrints(code: string): string[] {
  const out: string[] = [];
  const printRe = /print\s*\(\s*(f?)(["'])((?:\\.|(?!\2).)*)\2\s*\)/g;
  let m: RegExpExecArray | null;
  while ((m = printRe.exec(code)) !== null) {
    // f-strings: leave placeholders visible so learners see what would interpolate
    out.push(m[3].replace(/\\n/g, "\n"));
  }
  return out;
}

function detectSyntaxError(code: string, language: LessonLanguage): string | null {
  const open = (code.match(/\(/g) ?? []).length;
  const close = (code.match(/\)/g) ?? []).length;
  if (open !== close) {
    return language === "python"
      ? "SyntaxError: '(' was never closed"
      : "Error: unbalanced parentheses";
  }
  if (language === "python" && /^\s*(def|for|while|if|elif|else|class)\b[^:]*$/m.test(code)) {
    return "SyntaxError: expected ':'";
  }
  return null;
}

export function runCode(
  code: string,
  language: LessonLanguage,
  solutionCode: string,
  expectedOutput: string,
): RunResult {
  const durationMs = 120 + Math.floor(Math.random() * 380);

  if (!code.trim()) {
    return { stdout: "", stderr: "", durationMs, matchedExpected: false };
  }

  const syntaxError = detectSyntaxError(code, language);
  if (syntaxError) {
    return {
      stdout: "",
      stderr: `Traceback (most recent call last):\n  File "main.py", line 1\n${syntaxError}`,
      durationMs,
      matchedExpected: false,
    };
  }

  // Exact-intent match: learner reproduced the solution logic.
  if (normalize(code) === normalize(solutionCode)) {
    return { stdout: expectedOutput, stderr: "", durationMs, matchedExpected: true };
  }

  // Heuristic: solution's key expressions all present → treat as solved.
  const solutionKeyLines = solutionCode
    .split("\n")
    .map((l) => normalize(l))
    .filter((l) => l.length > 4);
  const normalizedUser = normalize(code);
  const covered =
    solutionKeyLines.length > 0 &&
    solutionKeyLines.every((l) => normalizedUser.includes(l));
  if (covered) {
    return { stdout: expectedOutput, stderr: "", durationMs, matchedExpected: true };
  }

  // Partial run: surface whatever literal prints we can find.
  const prints = extractPrints(code);
  if (prints.length > 0) {
    const stdout = prints.join("\n");
    return {
      stdout,
      stderr: "",
      durationMs,
      matchedExpected: stdout.trim() === expectedOutput.trim(),
    };
  }

  if (language === "sql") {
    return {
      stdout: "Query executed. 0 rows returned.\nHint: compare your query with the expected output panel.",
      stderr: "",
      durationMs,
      matchedExpected: false,
    };
  }

  return {
    stdout: "(program finished with no output)\nHint: use print() to inspect your values.",
    stderr: "",
    durationMs,
    matchedExpected: false,
  };
}
