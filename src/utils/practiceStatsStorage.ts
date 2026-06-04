const PRACTICE_STATS_KEY = 'transformer_practice_stats';

export interface PracticeStatsRecord {
  levelId: string;
  completedCount: number;
  bestTimeMs?: number;
  lastCompletedAt?: string;
  mistakeCount?: number;
}

export function readPracticeStats(): PracticeStatsRecord[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const parsed = JSON.parse(window.localStorage.getItem(PRACTICE_STATS_KEY) ?? '[]');

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((record): record is PracticeStatsRecord => {
      return record && typeof record.levelId === 'string' && typeof record.completedCount === 'number';
    });
  } catch {
    return [];
  }
}

export function recordPracticeCompletion(levelId: string, elapsedMs: number, mistakeCount: number) {
  if (typeof window === 'undefined') {
    return;
  }

  const stats = readPracticeStats();
  const existing = stats.find((record) => record.levelId === levelId);
  const now = new Date().toISOString();
  const nextStats = existing
    ? stats.map((record) =>
        record.levelId === levelId
          ? {
              ...record,
              completedCount: record.completedCount + 1,
              bestTimeMs: record.bestTimeMs ? Math.min(record.bestTimeMs, elapsedMs) : elapsedMs,
              lastCompletedAt: now,
              mistakeCount: (record.mistakeCount ?? 0) + mistakeCount,
            }
          : record,
      )
    : [
        ...stats,
        {
          levelId,
          completedCount: 1,
          bestTimeMs: elapsedMs,
          lastCompletedAt: now,
          mistakeCount,
        },
      ];

  window.localStorage.setItem(PRACTICE_STATS_KEY, JSON.stringify(nextStats));
}

export { PRACTICE_STATS_KEY };
