import { useEffect, useMemo, useRef, useState, type CSSProperties, type DragEvent } from 'react';
import { AchievementToast } from '../components/achievements/AchievementToast';
import { BuildArea } from '../components/BuildArea';
import { GameplayPanel } from '../components/gameplay/GameplayPanel';
import { LessonPanel } from '../components/LessonPanel';
import { ModuleCard } from '../components/ModuleCard';
import { PixelButton } from '../components/PixelButton';
import { TransformerFlowLab } from '../components/visual-lab/TransformerFlowLab';
import { levels } from '../data/levels';
import { transformerModules } from '../data/transformerModules';
import { useAuth } from '../auth/useAuth';
import { useI18n } from '../i18n/I18nProvider';
import { getMyProgress, markLevelCompleted, saveLevelProgress } from '../services/progressService';
import type { Achievement } from '../data/achievements';
import type { CheckResult, GameLevel, GameMode, GameProgress, ModuleId, PracticeLevel } from '../types/game';
import type { PageId } from '../types/navigation';
import type { TransformerModule } from '../types/transformerModule';
import {
  evaluateMilestoneAchievements,
  unlockAchievementsForCompletedModules,
} from '../utils/achievementStorage';
import { recordPracticeCompletion } from '../utils/practiceStatsStorage';

const STORAGE_KEY = 'transformer-workshop-progress';
const PRACTICE_COMPLETED_KEY = 'practice_completed_levels';
const LEFT_PANEL_COLLAPSED_KEY = 'transformer_left_panel_collapsed';
const RIGHT_PANEL_COLLAPSED_KEY = 'transformer_right_panel_collapsed';
const moduleById = new Map(transformerModules.map((module) => [module.id, module]));
const moduleIdByEnglishName = new Map(transformerModules.map((module) => [module.nameEn, module.id]));

interface GamePageProps {
  onNavigate: (page: PageId) => void;
  mode?: GameMode;
  practiceLevel?: PracticeLevel;
}

function loadProgress(): GameProgress {
  if (typeof window === 'undefined') {
    return { levelIndex: 0, highestUnlockedLevelIndex: 0, placedModuleIds: [] };
  }

  try {
    const rawProgress = window.localStorage.getItem(STORAGE_KEY);
    if (!rawProgress) {
      return { levelIndex: 0, highestUnlockedLevelIndex: 0, placedModuleIds: [] };
    }

    const progress = JSON.parse(rawProgress) as Partial<GameProgress>;
    const levelIndex =
      typeof progress.levelIndex === 'number' && progress.levelIndex >= 0 && progress.levelIndex < levels.length
        ? progress.levelIndex
        : 0;
    const placedModuleIds = Array.isArray(progress.placedModuleIds)
      ? progress.placedModuleIds.filter((id): id is ModuleId => typeof id === 'string' && moduleById.has(id))
      : [];
    const highestUnlockedLevelIndex =
      typeof progress.highestUnlockedLevelIndex === 'number' &&
      progress.highestUnlockedLevelIndex >= 0 &&
      progress.highestUnlockedLevelIndex < levels.length
        ? Math.max(progress.highestUnlockedLevelIndex, levelIndex)
        : levelIndex;

    return { levelIndex, highestUnlockedLevelIndex, placedModuleIds };
  } catch {
    return { levelIndex: 0, highestUnlockedLevelIndex: 0, placedModuleIds: [] };
  }
}

function saveProgress(progress: GameProgress) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function loadPanelCollapsedPreference(key: string) {
  if (typeof window === 'undefined') {
    return false;
  }

  const savedValue = window.localStorage.getItem(key);

  if (savedValue !== null) {
    return savedValue === 'true';
  }

  return window.matchMedia('(max-width: 760px)').matches;
}

function savePanelCollapsedPreference(key: string, isCollapsed: boolean) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(key, String(isCollapsed));
}

function loadCompletedPracticeLevelIds() {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const completedLevelIds = JSON.parse(window.localStorage.getItem(PRACTICE_COMPLETED_KEY) ?? '[]');
    return Array.isArray(completedLevelIds)
      ? completedLevelIds.filter((levelId): levelId is string => typeof levelId === 'string')
      : [];
  } catch {
    return [];
  }
}

function saveCompletedPracticeLevel(levelId: string) {
  if (typeof window === 'undefined') {
    return;
  }

  const completedLevelIds = loadCompletedPracticeLevelIds();

  if (!completedLevelIds.includes(levelId)) {
    window.localStorage.setItem(PRACTICE_COMPLETED_KEY, JSON.stringify([...completedLevelIds, levelId]));
  }
}

function createPracticeGameLevel(practiceLevel: PracticeLevel): GameLevel {
  return {
    id: practiceLevel.id,
    order: 1,
    title: practiceLevel.title,
    description: practiceLevel.goal,
    storyIntro: `自由练习启动：这次专注练习「${practiceLevel.title}」，可以反复试错直到顺手。`,
    botFeedback: `TransBot：练习完成！「${practiceLevel.title}」这部分语言理解能力更稳定了。`,
    missionTitle: practiceLevel.missionTitle,
    missionBrief: practiceLevel.missionBrief,
    storyProblem: practiceLevel.storyProblem,
    successFeedback: practiceLevel.successFeedback,
    conceptTakeaway: practiceLevel.conceptTakeaway,
    missionAnalogy: practiceLevel.missionAnalogy,
    todayLesson: practiceLevel.todayLesson,
    explainToOthers: practiceLevel.explainToOthers,
    targetModuleIds: practiceLevel.targetSequence
      .map((moduleName) => moduleIdByEnglishName.get(moduleName))
      .filter((moduleId): moduleId is ModuleId => Boolean(moduleId)),
  };
}

function checkOrder(placedModuleIds: ModuleId[], targetModuleIds: ModuleId[]): CheckResult {
  if (placedModuleIds.length === 0) {
    return {
      status: 'empty',
      message: '从左侧选择一个模块开始。可以先想：如果这是译前准备，第一步通常要先处理原文的哪一部分？',
    };
  }

  const hasWrongStep = placedModuleIds.some((moduleId, index) => moduleId !== targetModuleIds[index]);

  if (hasWrongStep || placedModuleIds.length > targetModuleIds.length) {
    return {
      status: 'wrong',
      message: '这里的顺序还不太顺。试着按翻译流程回想：先切分原文并保留语序，再判断上下文重点，最后再加工表达。',
    };
  }

  if (placedModuleIds.length === targetModuleIds.length) {
    return {
      status: 'complete',
      message: '很好！这一关的流程搭对了。你已经把这段“大模型如何读句子”的步骤串起来了。',
    };
  }

  return {
    status: 'correct',
    message: '方向正确，继续保持。下一块可以想想：当前片段接下来是需要保留语序、查上下文，还是继续加工理解？',
  };
}

function getRepairedMisconception(levelId: string) {
  const repairedByLevelId: Record<string, string> = {
    'text-enters-model': '把“切成 Token”和“理解整句话”分清了。',
    'attention-trio': '把 Query、Key、Value 的先后角色分清了。',
    'self-attention': '知道代词和长句不能孤立看，要回看上下文。',
    'transformer-core': '知道多头注意力不是重复做很多遍，而是多角度审句。',
    'full-transformer-flow': '知道输出不是直接跳出来，而是来自前面的逐步加工。',
  };

  return repairedByLevelId[levelId] ?? '把当前模块顺序和它解决的问题对应起来了。';
}

export function GamePage({ onNavigate, mode = 'campaign', practiceLevel }: GamePageProps) {
  const { user } = useAuth();
  const { language, t } = useI18n();
  const isPracticeMode = mode === 'practice';
  const [progress, setProgress] = useState<GameProgress>(() =>
    isPracticeMode ? { levelIndex: 0, highestUnlockedLevelIndex: 0, placedModuleIds: [] } : loadProgress(),
  );
  const [selectedModule, setSelectedModule] = useState<TransformerModule>(transformerModules[0]);
  const [useVisualLab, setUseVisualLab] = useState(true);
  const [visualLabCompleted, setVisualLabCompleted] = useState(false);
  const [visualLabResetSignal, setVisualLabResetSignal] = useState(0);
  const [showCompletionReview, setShowCompletionReview] = useState(false);
  const [achievementToastItems, setAchievementToastItems] = useState<Achievement[]>([]);
  const [isModulePanelCollapsed, setIsModulePanelCollapsed] = useState(() =>
    loadPanelCollapsedPreference(LEFT_PANEL_COLLAPSED_KEY),
  );
  const [isHintPanelCollapsed, setIsHintPanelCollapsed] = useState(() =>
    loadPanelCollapsedPreference(RIGHT_PANEL_COLLAPSED_KEY),
  );
  const [showAllModules, setShowAllModules] = useState(false);
  const [mistakeCount, setMistakeCount] = useState(0);
  const currentLevel =
    isPracticeMode && practiceLevel ? createPracticeGameLevel(practiceLevel) : levels[progress.levelIndex];
  const placedModules = useMemo(
    () => progress.placedModuleIds.map((moduleId) => moduleById.get(moduleId)).filter((module): module is TransformerModule => Boolean(module)),
    [progress.placedModuleIds],
  );
  const targetModuleIdSet = useMemo(() => new Set(currentLevel.targetModuleIds), [currentLevel.targetModuleIds]);
  const visibleModules = useMemo(
    () => (showAllModules ? transformerModules : transformerModules.filter((module) => targetModuleIdSet.has(module.id))),
    [showAllModules, targetModuleIdSet],
  );
  const currentTargetSequence = useMemo(
    () =>
      currentLevel.targetModuleIds
        .map((moduleId) => moduleById.get(moduleId)?.nameEn)
        .filter((moduleName): moduleName is string => Boolean(moduleName)),
    [currentLevel.targetModuleIds],
  );
  const checkResult = useMemo(
    () => checkOrder(progress.placedModuleIds, currentLevel.targetModuleIds),
    [currentLevel.targetModuleIds, progress.placedModuleIds],
  );
  const displayCheckResult: CheckResult = visualLabCompleted
    ? { status: 'complete', message: t('新版连接画布已经完成当前目标。') }
    : { ...checkResult, message: t(checkResult.message) };
  const isLevelComplete = checkResult.status === 'complete' || visualLabCompleted;
  const isLastLevel = progress.levelIndex === levels.length - 1;
  const highestUnlockedLevelIndex = progress.highestUnlockedLevelIndex ?? progress.levelIndex;
  const canEnterNextCampaignLevel = !isPracticeMode && !isLastLevel;
  const progressPercent = Math.min(
    100,
    visualLabCompleted ? 100 : Math.round((placedModules.length / currentLevel.targetModuleIds.length) * 100),
  );
  const gameLayoutStyle = {
    '--left-panel-width': isModulePanelCollapsed ? '48px' : '320px',
    '--right-panel-width': isHintPanelCollapsed ? '48px' : '300px',
  } as CSSProperties;
  const startedAtRef = useRef(Date.now());
  const mistakeCountRef = useRef(0);
  const lastLegacyMistakeLengthRef = useRef(0);
  const hasRecordedPracticeCompletionRef = useRef(false);
  const hasRecordedAchievementCompletionRef = useRef(false);
  const hasSavedRemoteCompletionRef = useRef(false);

  function updateProgress(nextProgress: GameProgress) {
    setProgress(nextProgress);

    if (!isPracticeMode) {
      saveProgress(nextProgress);
      void saveLevelProgress(`campaign:${levels[nextProgress.levelIndex].id}`, {
        levelTitle: levels[nextProgress.levelIndex].title,
        status: 'in_progress',
        mistakes: {
          placedModuleIds: nextProgress.placedModuleIds,
        },
      }).catch((error) => {
        console.warn('Supabase progress save failed.', error);
      });
    }
  }

  function resetVisualLabState() {
    setVisualLabCompleted(false);
    setVisualLabResetSignal((signal) => signal + 1);
    setShowCompletionReview(false);
    startedAtRef.current = Date.now();
    mistakeCountRef.current = 0;
    setMistakeCount(0);
    lastLegacyMistakeLengthRef.current = 0;
    hasRecordedPracticeCompletionRef.current = false;
    hasRecordedAchievementCompletionRef.current = false;
    hasSavedRemoteCompletionRef.current = false;
  }

  useEffect(() => {
    if (isPracticeMode || !user) {
      return;
    }

    let isMounted = true;

    getMyProgress()
      .then((rows) => {
        if (!isMounted) {
          return;
        }

        const completedCampaignIndexes = rows
          .filter((row) => row.status === 'completed' && row.level_id.startsWith('campaign:'))
          .map((row) => levels.findIndex((level) => `campaign:${level.id}` === row.level_id))
          .filter((index) => index >= 0);

        if (completedCampaignIndexes.length === 0) {
          return;
        }

        const highestCompletedIndex = Math.max(...completedCampaignIndexes);
        const highestUnlockedLevelIndex = Math.min(highestCompletedIndex + 1, levels.length - 1);

        setProgress((current) => ({
          ...current,
          highestUnlockedLevelIndex: Math.max(current.highestUnlockedLevelIndex ?? 0, highestUnlockedLevelIndex),
        }));
      })
      .catch((error) => {
        console.warn('Supabase progress load failed.', error);
      });

    return () => {
      isMounted = false;
    };
  }, [isPracticeMode, user]);

  useEffect(() => {
    if (isPracticeMode && practiceLevel && isLevelComplete && !hasRecordedPracticeCompletionRef.current) {
      saveCompletedPracticeLevel(practiceLevel.id);
      recordPracticeCompletion(practiceLevel.id, Date.now() - startedAtRef.current, mistakeCountRef.current);
      hasRecordedPracticeCompletionRef.current = true;
    }
  }, [isLevelComplete, isPracticeMode, practiceLevel]);

  useEffect(() => {
    if (!isLevelComplete || hasSavedRemoteCompletionRef.current) {
      return;
    }

    const remoteLevelId = `${mode}:${currentLevel.id}`;
    const score = Math.max(0, 100 - mistakeCountRef.current * 10);

    void markLevelCompleted(
      remoteLevelId,
      score,
      {
        mistakeCount: mistakeCountRef.current,
        repairedMisconception: getRepairedMisconception(currentLevel.id),
        mode,
      },
      currentLevel.title,
    ).catch((error) => {
      console.warn('Supabase completion save failed.', error);
    });

    hasSavedRemoteCompletionRef.current = true;
  }, [currentLevel.id, currentLevel.title, isLevelComplete, mode]);

  useEffect(() => {
    if (!isLevelComplete || hasRecordedAchievementCompletionRef.current) {
      return;
    }

    const unlocked = [
      ...unlockAchievementsForCompletedModules(currentLevel.targetModuleIds),
      ...evaluateMilestoneAchievements(),
    ];

    if (unlocked.length > 0) {
      setAchievementToastItems(unlocked);
    }

    hasRecordedAchievementCompletionRef.current = true;
  }, [currentLevel.targetModuleIds, isLevelComplete]);

  useEffect(() => {
    if (checkResult.status !== 'wrong') {
      return;
    }

    if (lastLegacyMistakeLengthRef.current === progress.placedModuleIds.length) {
      return;
    }

    mistakeCountRef.current += 1;
    setMistakeCount(mistakeCountRef.current);
    lastLegacyMistakeLengthRef.current = progress.placedModuleIds.length;

    const unlocked = evaluateMilestoneAchievements();

    if (unlocked.length > 0) {
      setAchievementToastItems(unlocked);
    }
  }, [checkResult.status, progress.placedModuleIds.length]);

  useEffect(() => {
    savePanelCollapsedPreference(LEFT_PANEL_COLLAPSED_KEY, isModulePanelCollapsed);
  }, [isModulePanelCollapsed]);

  useEffect(() => {
    savePanelCollapsedPreference(RIGHT_PANEL_COLLAPSED_KEY, isHintPanelCollapsed);
  }, [isHintPanelCollapsed]);

  function addModuleToBuild(module: TransformerModule) {
    setSelectedModule(module);
    updateProgress({
      levelIndex: progress.levelIndex,
      highestUnlockedLevelIndex,
      placedModuleIds: [...progress.placedModuleIds, module.id],
    });
  }

  function handleSelectModule(module: TransformerModule) {
    addModuleToBuild(module);
  }

  function handleDragStart(module: TransformerModule, event: DragEvent<HTMLButtonElement>) {
    event.dataTransfer.effectAllowed = 'copy';
    event.dataTransfer.setData('application/x-transformer-module-id', module.id);
    event.dataTransfer.setData('text/plain', module.id);
  }

  function handleDropModule(moduleId: string) {
    const module = moduleById.get(moduleId);

    if (module) {
      addModuleToBuild(module);
    }
  }

  function handleResetLevel() {
    updateProgress({
      levelIndex: progress.levelIndex,
      highestUnlockedLevelIndex,
      placedModuleIds: [],
    });
    resetVisualLabState();
  }

  function handleUndoLast() {
    updateProgress({
      levelIndex: progress.levelIndex,
      highestUnlockedLevelIndex,
      placedModuleIds: progress.placedModuleIds.slice(0, -1),
    });
  }

  function handleNextLevel() {
    const nextLevelIndex = Math.min(progress.levelIndex + 1, levels.length - 1);
    updateProgress({
      levelIndex: nextLevelIndex,
      highestUnlockedLevelIndex: Math.max(highestUnlockedLevelIndex, nextLevelIndex),
      placedModuleIds: [],
    });
    resetVisualLabState();
    setSelectedModule(transformerModules[0]);
  }

  function handleSelectCampaignLevel(levelIndex: number) {
    updateProgress({
      levelIndex,
      highestUnlockedLevelIndex,
      placedModuleIds: [],
    });
    resetVisualLabState();
    setSelectedModule(transformerModules[0]);
  }

  function handleVisualLabComplete() {
    setVisualLabCompleted(true);
  }

  function handleVisualLabMistake() {
    mistakeCountRef.current += 1;
    setMistakeCount(mistakeCountRef.current);
    const unlocked = evaluateMilestoneAchievements();

    if (unlocked.length > 0) {
      setAchievementToastItems(unlocked);
    }
  }

  return (
    <main className="game-page">
      <header className="game-header">
        <div>
          <p className="screen-label">{t(isPracticeMode ? '自由练习' : '搭建练习')}</p>
          <h1>{t(isPracticeMode ? '自由练习工作台' : 'Transformer 翻译工作台')}</h1>
        </div>
        <div className="level-hud" aria-label={t('当前关卡进度')}>
          <span>{isPracticeMode ? t('当前练习') : language === 'en' ? `Current level ${currentLevel.order} / ${levels.length}` : `当前关卡 ${currentLevel.order} / ${levels.length}`}</span>
          <strong>{t(currentLevel.title)}</strong>
          <div className="hud-progress" aria-label={language === 'en' ? `Current progress ${progressPercent}%` : `当前进度 ${progressPercent}%`}>
            <span style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
        <div className="game-header-actions">
          <PixelButton onClick={() => setUseVisualLab((current) => !current)}>
            {t(useVisualLab ? '切换旧版搭建区' : '使用新版可视化工坊')}
          </PixelButton>
          <PixelButton onClick={handleUndoLast}>{t('撤回一步')}</PixelButton>
          <PixelButton onClick={handleResetLevel}>{t('重置当前关卡')}</PixelButton>
          {isPracticeMode ? <PixelButton onClick={() => onNavigate('practice')}>{t('选择其他练习')}</PixelButton> : null}
          <PixelButton onClick={() => onNavigate('home')}>{t('返回主页')}</PixelButton>
        </div>
      </header>

      {!isPracticeMode ? (
        <section className="campaign-level-picker" aria-label={t('已解锁关卡选择')}>
          <div>
            <p className="screen-label">{t('已解锁关卡')}</p>
            <span>{t('可以回到已通关的练习重新搭建，最高进度会保留。')}</span>
          </div>
          <div className="campaign-level-buttons">
            {levels.slice(0, highestUnlockedLevelIndex + 1).map((level, index) => (
              <button
                className={index === progress.levelIndex ? 'campaign-level-button is-current' : 'campaign-level-button'}
                key={level.id}
                onClick={() => handleSelectCampaignLevel(index)}
                type="button"
              >
                <strong>{language === 'en' ? `Level ${level.order}` : `第 ${level.order} 关`}</strong>
                <span>{t(level.title)}</span>
              </button>
            ))}
          </div>
        </section>
      ) : null}

      <GameplayPanel currentLevel={currentLevel} checkResult={displayCheckResult} mistakeCount={mistakeCount} />

      <div
        className={`game-layout${isModulePanelCollapsed ? ' is-left-collapsed' : ''}${
          isHintPanelCollapsed ? ' is-right-collapsed' : ''
        }`}
        style={gameLayoutStyle}
      >
        <aside
          className={isModulePanelCollapsed ? 'module-warehouse side-panel-collapsed' : 'module-warehouse'}
          aria-label={t('模块仓库')}
        >
          {isModulePanelCollapsed ? (
            <button
              aria-label={t('展开模块仓库')}
              className="side-panel-tab"
              onClick={() => setIsModulePanelCollapsed(false)}
              type="button"
            >
              {t('模块')}
            </button>
          ) : (
            <>
          <div className="panel-heading">
            <div>
              <p className="screen-label">{t('模块仓库')}</p>
              <span>
                {language === 'en'
                  ? `${showAllModules ? transformerModules.length : visibleModules.length} / ${transformerModules.length} concept cards`
                  : `${showAllModules ? transformerModules.length : visibleModules.length} / ${transformerModules.length} 张概念卡片`}
              </span>
            </div>
            <div className="panel-heading-actions">
              <button className="mini-panel-button" onClick={() => setShowAllModules((current) => !current)} type="button">
                {t(showAllModules ? '只看本关模块' : '显示全部模块')}
              </button>
              <button
                aria-label={t('收起模块仓库')}
                className="mini-panel-button"
                onClick={() => setIsModulePanelCollapsed(true)}
                type="button"
              >
                {t('收起')}
              </button>
            </div>
          </div>
          <div className="module-list">
            {visibleModules.map((module) => (
              <ModuleCard
                isSelected={selectedModule.id === module.id}
                key={module.id}
                module={module}
                onDragStart={handleDragStart}
                onSelect={handleSelectModule}
              />
            ))}
          </div>
            </>
          )}
        </aside>

        <section className="build-workbench">
          <div className="panel-heading">
            <div>
              <p className="screen-label">
                {isPracticeMode
                  ? language === 'en'
                    ? `Free practice: ${t(currentLevel.title)}`
                    : `自由练习：${currentLevel.title}`
                  : language === 'en'
                    ? `Level ${currentLevel.order}: ${t(currentLevel.title)}`
                    : `第 ${currentLevel.order} 关：${currentLevel.title}`}
              </p>
              <span>{t(currentLevel.description)}</span>
              <span className="today-lesson-line">{language === 'en' ? `Today's one-liner: ${t(currentLevel.todayLesson)}` : `今日只学一句：${currentLevel.todayLesson}`}</span>
              <span className="story-line">{t(currentLevel.storyIntro)}</span>
            </div>
            <span>
              {language === 'en' ? `Progress ${placedModules.length} / ${currentLevel.targetModuleIds.length}` : `进度 ${placedModules.length} / ${currentLevel.targetModuleIds.length}`}
            </span>
          </div>
          {useVisualLab ? (
            <TransformerFlowLab
              embedded
              levelId={currentLevel.id}
              levelTitle={currentLevel.title}
              mission={currentLevel}
              mode={mode}
              onBackHome={() => onNavigate('home')}
              onBackToPracticeSelect={isPracticeMode ? () => onNavigate('practice') : undefined}
              onComplete={handleVisualLabComplete}
              onMistake={handleVisualLabMistake}
              resetSignal={visualLabResetSignal}
              targetSequence={currentTargetSequence}
            />
          ) : (
            <BuildArea
              checkResult={checkResult}
              modules={placedModules}
              onDropModule={handleDropModule}
              onNextLevel={handleNextLevel}
              showCompleteSummary
              showNextLevelButton={canEnterNextCampaignLevel}
              targetCount={currentLevel.targetModuleIds.length}
            />
          )}
        </section>

        {isHintPanelCollapsed ? (
          <aside className="lesson-panel side-panel-collapsed" aria-label={t('教学提示')}>
            <button
              aria-label={t('展开教学提示')}
              className="side-panel-tab"
              onClick={() => setIsHintPanelCollapsed(false)}
              type="button"
            >
              {t('提示')}
            </button>
          </aside>
        ) : (
          <div className="lesson-panel-shell">
            <button
              aria-label={t('收起教学提示')}
              className="lesson-collapse-button"
              onClick={() => setIsHintPanelCollapsed(true)}
              type="button"
            >
              {t('收起提示')}
            </button>
            <LessonPanel
              checkResult={displayCheckResult}
              currentLevel={currentLevel}
              mistakeCount={mistakeCount}
              placedCount={placedModules.length}
              selectedModule={selectedModule}
            />
          </div>
        )}
      </div>

      {isLevelComplete ? (
        <div className="level-complete-overlay" role="dialog" aria-modal="true" aria-label={t('关卡完成')}>
          <div className="level-complete-modal">
            <div className="complete-sparkles" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
            </div>
            <p className="screen-label">{t(isPracticeMode ? '练习完成！' : '关卡完成！')}</p>
            <h2>
              {isPracticeMode
                ? language === 'en'
                  ? `You completed "${t(currentLevel.title)}".`
                  : `你已经完成了「${currentLevel.title}」。`
                : language === 'en'
                  ? `Level ${currentLevel.order} cleared`
                  : `第 ${currentLevel.order} 关通关`}
            </h2>
            <p>
              {t(currentLevel.successFeedback)}
            </p>
            <p>{t(currentLevel.conceptTakeaway)}</p>
            <p>{t(currentLevel.missionAnalogy)}</p>
            <div className="complete-repair-card">
              <strong>{t('你刚刚修复的误区')}</strong>
              <span>{t(getRepairedMisconception(currentLevel.id))}</span>
            </div>
            <div className="complete-explain-card">
              <strong>{t('你现在可以这样解释给别人听')}</strong>
              <span>{t(currentLevel.explainToOthers)}</span>
            </div>
            <p className="bot-feedback">{t(currentLevel.botFeedback)}</p>
            {showCompletionReview ? (
              <div className="complete-review-card">
                <strong>{t('本关复盘')}</strong>
                <span>{language === 'en' ? `Story problem: ${t(currentLevel.storyProblem)}` : `剧情问题：${currentLevel.storyProblem}`}</span>
                <span>{language === 'en' ? `Goal: ${t(currentLevel.missionBrief)}` : `操作目标：${currentLevel.missionBrief}`}</span>
                <span>{language === 'en' ? `Learning summary: ${t(currentLevel.conceptTakeaway)}` : `学习总结：${currentLevel.conceptTakeaway}`}</span>
              </div>
            ) : null}
            {isPracticeMode ? (
              <div className="complete-actions">
                <PixelButton onClick={handleResetLevel}>{t('再练一次')}</PixelButton>
                <PixelButton onClick={() => setShowCompletionReview((current) => !current)}>
                  {t(showCompletionReview ? '收起本关复盘' : '查看本关复盘')}
                </PixelButton>
                <PixelButton onClick={() => onNavigate('practice')}>{t('选择其他练习')}</PixelButton>
                <PixelButton onClick={() => onNavigate('home')}>{t('返回首页')}</PixelButton>
              </div>
            ) : isLastLevel ? (
              <div className="complete-actions">
                <PixelButton onClick={handleResetLevel}>{t('再练一次')}</PixelButton>
                <PixelButton onClick={() => setShowCompletionReview((current) => !current)}>
                  {t(showCompletionReview ? '收起本关复盘' : '查看本关复盘')}
                </PixelButton>
                <PixelButton onClick={() => onNavigate('home')}>{t('返回首页')}</PixelButton>
              </div>
            ) : (
              <div className="complete-actions">
                <PixelButton onClick={handleNextLevel}>{t('继续下一关')}</PixelButton>
                <PixelButton onClick={handleResetLevel}>{t('再练一次')}</PixelButton>
                <PixelButton onClick={() => setShowCompletionReview((current) => !current)}>
                  {t(showCompletionReview ? '收起本关复盘' : '查看本关复盘')}
                </PixelButton>
              </div>
            )}
          </div>
        </div>
      ) : null}
      <AchievementToast achievements={achievementToastItems} onDismiss={() => setAchievementToastItems([])} />
    </main>
  );
}
