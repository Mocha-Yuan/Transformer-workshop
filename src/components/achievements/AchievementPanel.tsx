import { useMemo } from 'react';
import { achievements } from '../../data/achievements';
import { getUnlockedAchievementIds } from '../../utils/achievementStorage';
import './achievements.css';

export function AchievementPanel() {
  const unlockedIds = useMemo(() => getUnlockedAchievementIds(), []);

  return (
    <section className="achievement-panel" aria-label="我的成就">
      <div className="achievement-panel-header">
        <div>
          <p className="screen-label">我的成就</p>
          <h2>{unlockedIds.size} / {achievements.length} 已解锁</h2>
        </div>
        <span>完成关卡、复盘错误和自由练习都会点亮新徽章。</span>
      </div>
      <div className="achievement-grid">
        {achievements.map((achievement) => {
          const isUnlocked = unlockedIds.has(achievement.id);

          return (
            <article className={isUnlocked ? 'achievement-card is-unlocked' : 'achievement-card'} key={achievement.id}>
              <span className="achievement-badge" aria-hidden="true">
                {isUnlocked ? '★' : '?'}
              </span>
              <div>
                <strong>{achievement.title}</strong>
                <p>{achievement.description}</p>
                <small>{isUnlocked ? achievement.unlockHint : '尚未解锁，继续修复 TransBot。'}</small>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
