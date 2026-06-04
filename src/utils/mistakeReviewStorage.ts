const MISTAKE_REVIEW_KEY = 'transformer_mistake_review';

export interface MistakeReviewRecord {
  misconceptionId: string;
  count: number;
  lastSeenAt: string;
}

export function readMistakeReviewRecords(): MistakeReviewRecord[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const parsed = JSON.parse(window.localStorage.getItem(MISTAKE_REVIEW_KEY) ?? '[]');

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((record): record is MistakeReviewRecord => {
      return (
        record &&
        typeof record.misconceptionId === 'string' &&
        typeof record.count === 'number' &&
        typeof record.lastSeenAt === 'string'
      );
    });
  } catch {
    return [];
  }
}

export function recordMistakeReview(misconceptionId: string) {
  if (typeof window === 'undefined') {
    return;
  }

  const records = readMistakeReviewRecords();
  const existingRecord = records.find((record) => record.misconceptionId === misconceptionId);
  const now = new Date().toISOString();
  const nextRecords = existingRecord
    ? records.map((record) =>
        record.misconceptionId === misconceptionId
          ? { ...record, count: record.count + 1, lastSeenAt: now }
          : record,
      )
    : [...records, { misconceptionId, count: 1, lastSeenAt: now }];

  window.localStorage.setItem(MISTAKE_REVIEW_KEY, JSON.stringify(nextRecords));
}

export { MISTAKE_REVIEW_KEY };
