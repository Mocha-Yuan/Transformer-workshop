import type { CheckResult, GameLevel } from '../types/game';
import { useI18n } from '../i18n/I18nProvider';
import type { TransformerModule } from '../types/transformerModule';

interface LessonPanelProps {
  selectedModule: TransformerModule;
  placedCount: number;
  currentLevel: GameLevel;
  checkResult: CheckResult;
  mistakeCount: number;
}

const feedbackTitles: Record<CheckResult['status'], string> = {
  empty: '现在做什么',
  correct: '方向对了',
  wrong: '这一处需要调整',
  complete: '本关完成',
};

function getFeedback(status: CheckResult['status'], mistakeCount: number) {
  if (status === 'wrong') {
    if (mistakeCount <= 1) {
      return '第一次错没关系：先撤回，再想“前一步有没有准备好语义或线索”。';
    }

    if (mistakeCount === 2) {
      return '第二次错：看画布里高亮的下一步，它就是当前最该补上的模块。';
    }

    return '第三次以后：可以先看答案演示，系统收起答案后再自己搭一次。';
  }

  const conciseFeedback: Record<CheckResult['status'], string> = {
    empty: '先从左侧选择第一个模块。',
    correct: '方向对了，继续放下一个模块。',
    wrong: '顺序不对。撤回这一步，再看目标顺序。',
    complete: '搭对了。本关流程已经接通。',
  };

  return conciseFeedback[status];
}

export function LessonPanel({ selectedModule, placedCount, currentLevel, checkResult, mistakeCount }: LessonPanelProps) {
  const { t } = useI18n();

  return (
    <aside className="lesson-panel" aria-label={t('教学提示面板')}>
      <p className="screen-label">{t('本关提示')}</p>

      <div className="level-card">
        <span>{t('今日只学一句')}</span>
        <strong>{t(currentLevel.todayLesson)}</strong>
        <em>{t(currentLevel.missionBrief)}</em>
      </div>

      <div className={`lesson-chip lesson-chip-${selectedModule.color}`} aria-hidden="true" />
      <h2>{t(selectedModule.roleName)}</h2>
      <p className="lesson-en">{selectedModule.nameEn}</p>
      <p className="lesson-detail">{t(selectedModule.summary)}</p>

      <div className={`lesson-feedback lesson-feedback-${checkResult.status}`}>
        <strong>{t(feedbackTitles[checkResult.status])}</strong>
        <span>{t(getFeedback(checkResult.status, mistakeCount))}</span>
      </div>

      {mistakeCount > 0 ? (
        <div className="lesson-mistake-ladder" aria-label={t('错误递进提示')}>
          <span className={mistakeCount >= 1 ? 'is-active' : undefined}>{t('1 提醒原因')}</span>
          <span className={mistakeCount >= 2 ? 'is-active' : undefined}>{t('2 高亮缺口')}</span>
          <span className={mistakeCount >= 3 ? 'is-active' : undefined}>{t('3 看演示再挑战')}</span>
        </div>
      ) : null}

      <div className="lesson-stat">
        <span>{t('已放置模块')}</span>
        <strong>{placedCount}</strong>
      </div>
    </aside>
  );
}
