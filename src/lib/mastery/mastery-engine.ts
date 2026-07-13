/* ------------------------------------------------------------------ */
/*  DSM Mastery Engine                                                  */
/*                                                                     */
/*  Pure selectors over LessonProgress + a React hook.                 */
/*  No UI coupling, no event emission, no side effects.                */
/*  Scoring is driven by per-lesson LessonMasteryConfig — nothing is  */
/*  hardcoded in this file or in renderers.                            */
/* ------------------------------------------------------------------ */

import {
  useLearningProgress,
  type LessonProgress,
} from "@/lib/store/learning-progress";
import type {
  LessonMasteryConfig,
  LessonMasteryResult,
  AggregateMasteryResult,
} from "./types";

export type { LessonMasteryConfig, LessonMasteryResult, AggregateMasteryResult };
export type { BlockMasteryRule } from "./types";

/* ------------------------------------------------------------------ */
/*  Core computation (pure — no store access)                          */
/* ------------------------------------------------------------------ */

const DEFAULT_PASSING = 80;

function computeLessonMastery(
  progress: LessonProgress | undefined,
  config?: LessonMasteryConfig,
): LessonMasteryResult {
  const blocks = progress?.blocks ?? {};

  if (!config || config.rules.length === 0) {
    const mastered = progress?.status === "completed";
    return {
      score: mastered ? 100 : 0,
      mastered,
      requiredBlocksMet: mastered,
      completedBlocks: 0,
      totalRuledBlocks: 0,
    };
  }

  const { rules, passingScore = DEFAULT_PASSING, quizWeight = 0 } = config;

  let totalWeight = 0;
  let earnedWeight = 0;
  let requiredBlocksMet = true;
  let completedBlocks = 0;

  for (const rule of rules) {
    const w = rule.weight ?? 1;
    totalWeight += w;
    const done = !!blocks[rule.blockId]?.completedAt;
    if (done) {
      earnedWeight += w;
      completedBlocks++;
    } else if (rule.required) {
      requiredBlocksMet = false;
    }
  }

  const completionScore = totalWeight > 0 ? (earnedWeight / totalWeight) * 100 : 0;
  const quizScore = progress?.lastScore ?? 0;
  const blend = Math.max(0, Math.min(1, quizWeight));
  const score = Math.round(completionScore * (1 - blend) + quizScore * blend);
  const mastered = requiredBlocksMet && score >= passingScore;

  return {
    score,
    mastered,
    requiredBlocksMet,
    completedBlocks,
    totalRuledBlocks: rules.length,
  };
}

/* ------------------------------------------------------------------ */
/*  Pure selectors — call with store state snapshot                    */
/* ------------------------------------------------------------------ */

export function getLessonMastery(
  lessons: Record<string, LessonProgress>,
  lessonId: string,
  config?: LessonMasteryConfig,
): LessonMasteryResult {
  return computeLessonMastery(lessons[lessonId], config);
}

export function hasMasteredLesson(
  lessons: Record<string, LessonProgress>,
  lessonId: string,
  config?: LessonMasteryConfig,
): boolean {
  return getLessonMastery(lessons, lessonId, config).mastered;
}

export function getModuleMastery(
  lessons: Record<string, LessonProgress>,
  lessonIds: string[],
  configs?: Record<string, LessonMasteryConfig>,
): AggregateMasteryResult {
  let totalScore = 0;
  let masteredCount = 0;
  for (const id of lessonIds) {
    const r = getLessonMastery(lessons, id, configs?.[id]);
    totalScore += r.score;
    if (r.mastered) masteredCount++;
  }
  const n = lessonIds.length;
  return {
    score: n > 0 ? Math.round(totalScore / n) : 0,
    masteredCount,
    totalCount: n,
    allMastered: n > 0 && masteredCount === n,
  };
}

export function getCourseMastery(
  lessons: Record<string, LessonProgress>,
  lessonIds: string[],
  configs?: Record<string, LessonMasteryConfig>,
): AggregateMasteryResult {
  return getModuleMastery(lessons, lessonIds, configs);
}

/* ------------------------------------------------------------------ */
/*  React hook — selectors bound to the live Zustand store             */
/* ------------------------------------------------------------------ */

export function useMastery() {
  const lessons = useLearningProgress((s) => s.lessons);
  return {
    getLessonMastery: (id: string, cfg?: LessonMasteryConfig) =>
      getLessonMastery(lessons, id, cfg),
    hasMasteredLesson: (id: string, cfg?: LessonMasteryConfig) =>
      hasMasteredLesson(lessons, id, cfg),
    getModuleMastery: (ids: string[], cfgs?: Record<string, LessonMasteryConfig>) =>
      getModuleMastery(lessons, ids, cfgs),
    getCourseMastery: (ids: string[], cfgs?: Record<string, LessonMasteryConfig>) =>
      getCourseMastery(lessons, ids, cfgs),
  };
}
