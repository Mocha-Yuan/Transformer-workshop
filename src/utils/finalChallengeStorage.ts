const FINAL_CHALLENGE_KEY = 'transformer_final_challenge_records';

export interface FinalChallengeRecord {
  completedAt: string;
  elapsedMs: number;
  mistakeCount: number;
  confusedModule?: string;
}

export function readFinalChallengeRecords(): FinalChallengeRecord[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const parsed = JSON.parse(window.localStorage.getItem(FINAL_CHALLENGE_KEY) ?? '[]');

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((record): record is FinalChallengeRecord => {
      return record && typeof record.completedAt === 'string' && typeof record.elapsedMs === 'number';
    });
  } catch {
    return [];
  }
}

export function recordFinalChallenge(record: Omit<FinalChallengeRecord, 'completedAt'>) {
  if (typeof window === 'undefined') {
    return;
  }

  const records = readFinalChallengeRecords();
  const nextRecord: FinalChallengeRecord = {
    ...record,
    completedAt: new Date().toISOString(),
  };

  window.localStorage.setItem(FINAL_CHALLENGE_KEY, JSON.stringify([nextRecord, ...records].slice(0, 12)));
}

export { FINAL_CHALLENGE_KEY };
