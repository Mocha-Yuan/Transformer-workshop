import type { Achievement } from '../../data/achievements';
import './achievements.css';

interface AchievementToastProps {
  achievements: Achievement[];
  onDismiss: () => void;
}

export function AchievementToast({ achievements, onDismiss }: AchievementToastProps) {
  if (achievements.length === 0) {
    return null;
  }

  const latestAchievement = achievements[achievements.length - 1];

  return (
    <div className="achievement-toast" role="status" aria-live="polite">
      <div className="achievement-toast-gem" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>
      <div>
        <strong>成就解锁：{latestAchievement.title}！</strong>
        <p>{latestAchievement.unlockHint}</p>
      </div>
      <button className="mini-panel-button" onClick={onDismiss} type="button">
        收起
      </button>
    </div>
  );
}
