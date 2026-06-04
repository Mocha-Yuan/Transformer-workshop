import { achievements, type Achievement } from '../data/achievements';
import { practiceLevels } from '../data/practiceLevels';
import type { ModuleId } from '../types/game';
import { readMistakeReviewRecords } from './mistakeReviewStorage';
import { readPracticeStats } from './practiceStatsStorage';

const ACHIEVEMENT_KEY = 'transformer_achievements';

export interface AchievementUnlockRecord {
  achievementId: string;
  unlockedAt: string;
}

function readUnlockRecords(): AchievementUnlockRecord[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const parsed = JSON.parse(window.localStorage.getItem(ACHIEVEMENT_KEY) ?? '[]');

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((record): record is AchievementUnlockRecord => {
      return record && typeof record.achievementId === 'string' && typeof record.unlockedAt === 'string';
    });
  } catch {
    return [];
  }
}

function saveUnlockRecords(records: AchievementUnlockRecord[]) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(ACHIEVEMENT_KEY, JSON.stringify(records));
}

export function getUnlockedAchievementIds() {
  return new Set(readUnlockRecords().map((record) => record.achievementId));
}

export function getAchievementProgress() {
  const unlockedIds = getUnlockedAchievementIds();

  return achievements.map((achievement) => ({
    achievement,
    isUnlocked: unlockedIds.has(achievement.id),
  }));
}

export function unlockAchievement(achievementId: string): Achievement[] {
  const achievement = achievements.find((item) => item.id === achievementId);

  if (!achievement) {
    return [];
  }

  const records = readUnlockRecords();

  if (records.some((record) => record.achievementId === achievementId)) {
    return [];
  }

  saveUnlockRecords([...records, { achievementId, unlockedAt: new Date().toISOString() }]);
  return [achievement];
}

export function unlockAchievementsForCompletedModules(moduleIds: ModuleId[]) {
  const moduleSet = new Set(moduleIds);
  const newlyUnlocked: Achievement[] = [];

  achievements.forEach((achievement) => {
    if (achievement.moduleId && moduleSet.has(achievement.moduleId)) {
      newlyUnlocked.push(...unlockAchievement(achievement.id));
    }
  });

  return newlyUnlocked;
}

export function evaluateMilestoneAchievements() {
  const newlyUnlocked: Achievement[] = [];
  const mistakeReviewCount = readMistakeReviewRecords().reduce((total, record) => total + record.count, 0);
  const practiceCompletedCount = readPracticeStats().reduce((total, stat) => total + stat.completedCount, 0);
  const completedPracticeIds = new Set(readPracticeStats().filter((stat) => stat.completedCount > 0).map((stat) => stat.levelId));

  if (mistakeReviewCount >= 3) {
    newlyUnlocked.push(...unlockAchievement('review-master'));
  }

  if (practiceCompletedCount >= 5 || completedPracticeIds.size >= practiceLevels.length) {
    newlyUnlocked.push(...unlockAchievement('practice-regular'));
  }

  return newlyUnlocked;
}

export { ACHIEVEMENT_KEY };
