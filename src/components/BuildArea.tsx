import { useState, type DragEvent } from 'react';
import { useI18n } from '../i18n/I18nProvider';
import type { CheckResult } from '../types/game';
import type { TransformerModule } from '../types/transformerModule';
import { PixelButton } from './PixelButton';

interface BuildAreaProps {
  modules: TransformerModule[];
  targetCount: number;
  checkResult: CheckResult;
  onNextLevel: () => void;
  onDropModule: (moduleId: string) => void;
  showNextLevelButton: boolean;
  showCompleteSummary: boolean;
}

const conciseFeedback: Record<CheckResult['status'], string> = {
  empty: '把左侧模块拖到这里。',
  correct: '方向对了，继续下一块。',
  wrong: '顺序不对，撤回后重试。',
  complete: '本次搭建完成。',
};

export function BuildArea({
  modules,
  targetCount,
  checkResult,
  onNextLevel,
  onDropModule,
  showNextLevelButton,
  showCompleteSummary,
}: BuildAreaProps) {
  const { language, t } = useI18n();
  const [isDragOver, setIsDragOver] = useState(false);
  const feedbackStatus =
    checkResult.status === 'complete' ? 'correct' : checkResult.status === 'wrong' ? 'wrong' : checkResult.status;

  function handleDragOver(event: DragEvent<HTMLElement>) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
    setIsDragOver(true);
  }

  function handleDrop(event: DragEvent<HTMLElement>) {
    event.preventDefault();
    setIsDragOver(false);

    const moduleId =
      event.dataTransfer.getData('application/x-transformer-module-id') ||
      event.dataTransfer.getData('text/plain');

    if (moduleId) {
      onDropModule(moduleId);
    }
  }

  return (
    <section
      className={`build-area build-area-${feedbackStatus}${isDragOver ? ' is-drag-over' : ''}`}
      aria-label={t('Transformer 搭建区')}
      onDragLeave={() => setIsDragOver(false)}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {feedbackStatus === 'correct' ? (
        <div className="pixel-flash pixel-flash-correct" key={`flash-${modules.length}`} aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>
      ) : null}

      <div className="target-slots" aria-label={t('当前关卡目标槽位')}>
        {Array.from({ length: targetCount }, (_, index) => (
          <span className={index < modules.length ? 'target-slot is-filled' : 'target-slot'} key={index}>
            {index + 1}
          </span>
        ))}
      </div>

      {modules.length === 0 ? (
        <div className="empty-build">
          <span className="empty-grid" aria-hidden="true" />
          <p>{t('拖入第一个模块，或直接点击左侧卡片添加。')}</p>
        </div>
      ) : (
        <ol className="build-stack">
          {modules.map((module, index) => (
            <li
              className={`build-block build-block-${module.color}${
                index === modules.length - 1 ? ` build-block-feedback-${feedbackStatus}` : ''
              }`}
              key={`${module.id}-${index}`}
            >
              <span className="build-pixel-gem" aria-hidden="true">
                <span />
                <span />
                <span />
                <span />
              </span>
              <span className="build-index">{String(index + 1).padStart(2, '0')}</span>
              <span>
                <strong>{language === 'en' ? module.nameEn : module.nameZh}</strong>
                <small>{module.nameEn}</small>
              </span>
            </li>
          ))}
        </ol>
      )}

      <div className={`check-message check-message-${checkResult.status}`} role="status">
        <p>{t(conciseFeedback[checkResult.status])}</p>
        {checkResult.status === 'complete' && showNextLevelButton ? (
          <PixelButton onClick={onNextLevel}>{t('进入下一关')}</PixelButton>
        ) : null}
        {checkResult.status === 'complete' && showCompleteSummary && !showNextLevelButton ? (
          <strong>{t('可以在弹窗中选择下一步。')}</strong>
        ) : null}
      </div>
    </section>
  );
}
