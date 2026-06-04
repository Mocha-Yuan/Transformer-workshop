import { PixelButton } from '../components/PixelButton';
import { practiceLevels } from '../data/practiceLevels';
import { useI18n } from '../i18n/I18nProvider';
import type { Language } from '../i18n/translations';
import type { PageId } from '../types/navigation';
import { readPracticeStats, type PracticeStatsRecord } from '../utils/practiceStatsStorage';

interface PracticeSelectPageProps {
  onNavigate: (page: PageId) => void;
  onStartPractice: (levelId: string) => void;
}

function formatTime(ms: number | undefined, language: Language) {
  if (!ms) {
    return language === 'en' ? 'None yet' : '暂无';
  }

  const seconds = Math.max(1, Math.round(ms / 1000));
  const minutes = Math.floor(seconds / 60);
  const restSeconds = seconds % 60;

  if (language === 'en') {
    return minutes > 0 ? `${minutes}m ${restSeconds}s` : `${restSeconds}s`;
  }

  return minutes > 0 ? `${minutes}分${restSeconds}秒` : `${restSeconds}秒`;
}

function formatDate(value: string | undefined, language: Language) {
  if (!value) {
    return language === 'en' ? 'None yet' : '暂无';
  }

  return new Date(value).toLocaleDateString(language === 'en' ? 'en-US' : 'zh-CN', { month: 'short', day: 'numeric' });
}

function getReviewRecommendation(stats: PracticeStatsRecord[]) {
  const neverCompletedLevel = practiceLevels.find((level) => {
    const stat = stats.find((item) => item.levelId === level.id);
    return !stat || stat.completedCount === 0;
  });

  if (neverCompletedLevel) {
    return {
      title: neverCompletedLevel.title,
      reason: '这关还没有完成记录，适合先补齐学习地图。',
    };
  }

  const mostMistakes = stats.slice().sort((first, second) => (second.mistakeCount ?? 0) - (first.mistakeCount ?? 0))[0];
  const mistakeLevel = practiceLevels.find((level) => level.id === mostMistakes?.levelId);

  if (mistakeLevel && (mostMistakes?.mistakeCount ?? 0) > 0) {
    return {
      title: mistakeLevel.title,
      reason: `你最近在这个练习里累计出错 ${mostMistakes?.mistakeCount ?? 0} 次，适合复盘连接顺序。`,
    };
  }

  const oldest = stats
    .filter((item) => item.lastCompletedAt)
    .slice()
    .sort((first, second) => Date.parse(first.lastCompletedAt ?? '') - Date.parse(second.lastCompletedAt ?? ''))[0];
  const oldestLevel = practiceLevels.find((level) => level.id === oldest?.levelId) ?? practiceLevels[0];

  return {
    title: oldestLevel.title,
    reason: '这关距离上次练习最久，适合用来热身。',
  };
}

export function PracticeSelectPage({ onNavigate, onStartPractice }: PracticeSelectPageProps) {
  const { language, t } = useI18n();
  const stats = readPracticeStats();
  const statByLevelId = new Map(stats.map((stat) => [stat.levelId, stat]));
  const totalPracticeCount = stats.reduce((total, stat) => total + stat.completedCount, 0);
  const recentPractice = stats
    .filter((stat) => stat.lastCompletedAt)
    .slice()
    .sort((first, second) => Date.parse(second.lastCompletedAt ?? '') - Date.parse(first.lastCompletedAt ?? ''))[0];
  const recentPracticeLevel = practiceLevels.find((level) => level.id === recentPractice?.levelId);
  const recommendation = getReviewRecommendation(stats);

  return (
    <main className="practice-page">
      <header className="practice-header">
        <div>
          <p className="screen-label">自由练习</p>
          <h1>选择你的 Transformer 练习任务</h1>
          <p>像搭积木一样选择一个任务，反复练习 Transformer 的关键结构。</p>
        </div>
        <div className="practice-actions">
          <PixelButton onClick={() => onNavigate('game')}>进入闯关模式</PixelButton>
          <PixelButton onClick={() => onNavigate('home')}>返回主页</PixelButton>
        </div>
      </header>

      <section className="practice-stats-panel" aria-label="自由练习学习统计">
        <div>
          <p className="screen-label">学习统计</p>
          <strong>{language === 'en' ? `Total practice runs: ${totalPracticeCount}` : `总练习次数：${totalPracticeCount}`}</strong>
          <span>
            {language === 'en'
              ? `Recent practice: ${
                  recentPracticeLevel ? `${t(recentPracticeLevel.title)} (${formatDate(recentPractice?.lastCompletedAt, language)})` : 'None yet'
                }`
              : `最近练习：${recentPracticeLevel ? `${recentPracticeLevel.title}（${formatDate(recentPractice?.lastCompletedAt, language)}）` : '暂无'}`}
          </span>
        </div>
        <div>
          <p className="screen-label">推荐复习</p>
          <strong>{t(recommendation.title)}</strong>
          <span>{t(recommendation.reason)}</span>
        </div>
      </section>

      <section className="practice-grid" aria-label="自由练习关卡列表">
        {practiceLevels.map((level) => (
          <article className="practice-card" key={level.id}>
            {(() => {
              const stat = statByLevelId.get(level.id);

              return (
                <div className="practice-card-stats">
                  <span>{language === 'en' ? `Completed ${stat?.completedCount ?? 0} times` : `完成 ${stat?.completedCount ?? 0} 次`}</span>
                  <span>{language === 'en' ? `Best ${formatTime(stat?.bestTimeMs, language)}` : `最快 ${formatTime(stat?.bestTimeMs, language)}`}</span>
                  <span>{language === 'en' ? `Recent ${formatDate(stat?.lastCompletedAt, language)}` : `最近 ${formatDate(stat?.lastCompletedAt, language)}`}</span>
                </div>
              );
            })()}
            <div className="practice-card-top">
              <span className={`difficulty-badge difficulty-${level.difficulty}`}>{t(level.difficulty)}</span>
              <strong>{language === 'en' ? `${level.targetSequence.length} modules` : `${level.targetSequence.length} 个模块`}</strong>
            </div>
            <h2>{t(level.title)}</h2>
            <p>{t(level.goal)}</p>
            <div className="practice-sequence" aria-label={`${level.title} 目标模块`}>
              {level.targetSequence.map((moduleName, index) => (
                <span key={`${level.id}-${moduleName}-${index}`}>{moduleName}</span>
              ))}
            </div>
            <PixelButton onClick={() => onStartPractice(level.id)}>开始练习</PixelButton>
          </article>
        ))}
      </section>
    </main>
  );
}
