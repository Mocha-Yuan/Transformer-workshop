import { useMemo, useRef, useState } from 'react';
import { AchievementToast } from '../components/achievements/AchievementToast';
import { PixelButton } from '../components/PixelButton';
import { TransformerFlowLab } from '../components/visual-lab/TransformerFlowLab';
import { misconceptions } from '../data/misconceptions';
import { markLevelCompleted } from '../services/progressService';
import type { Achievement } from '../data/achievements';
import type { LevelMission } from '../types/game';
import type { PageId } from '../types/navigation';
import { unlockAchievement } from '../utils/achievementStorage';
import { recordFinalChallenge } from '../utils/finalChallengeStorage';
import { readMistakeReviewRecords } from '../utils/mistakeReviewStorage';

const finalChallengeSequence = [
  'Token',
  'Embedding',
  'Position Encoding',
  'Multi-Head Attention',
  'Add & Norm',
  'Feed Forward',
  'Add & Norm',
  'Output',
];

const finalChallengeMission: LevelMission = {
  missionTitle: '最终挑战：重建完整理解线路',
  missionBrief: '从 Token 一直连接到 Output。',
  storyProblem: 'TransBot 的完整线路被打乱了。',
  successFeedback: '最终挑战完成！整条语言理解线路重新亮起。',
  conceptTakeaway: '你已经串起切片、语义、语序、注意力、加工和输出。',
  missionAnalogy: '像完成了一次从读原文到组织表达的完整流程。',
  todayLesson: '输出来自前面一步步理解加工，不是直接跳出来的。',
  explainToOthers: 'Transformer 会先切分句子，建立语义和位置，再回看上下文，最后加工成输出。',
};

interface FinalChallengePageProps {
  onNavigate: (page: PageId) => void;
}

function formatDuration(ms: number) {
  const seconds = Math.max(1, Math.round(ms / 1000));
  const minutes = Math.floor(seconds / 60);
  const restSeconds = seconds % 60;

  return minutes > 0 ? `${minutes}分${restSeconds}秒` : `${restSeconds}秒`;
}

function getMostConfusedMisconceptionTitle() {
  const records = readMistakeReviewRecords();

  if (records.length === 0) {
    return '暂无明显混淆模块';
  }

  const mostFrequent = records.slice().sort((first, second) => second.count - first.count)[0];
  const misconception = misconceptions.find((item) => item.id === mostFrequent.misconceptionId);

  return misconception?.title ?? '连接顺序';
}

export function FinalChallengePage({ onNavigate }: FinalChallengePageProps) {
  const [runId, setRunId] = useState(() => Date.now());
  const [report, setReport] = useState<{ elapsedMs: number; mistakeCount: number; confusedModule: string }>();
  const [achievementToastItems, setAchievementToastItems] = useState<Achievement[]>([]);
  const startedAtRef = useRef(Date.now());
  const mistakeCountRef = useRef(0);
  const hasCompletedRef = useRef(false);
  const levelId = useMemo(() => `final-challenge-${runId}`, [runId]);

  function handleMistake() {
    mistakeCountRef.current += 1;
  }

  function handleComplete() {
    if (hasCompletedRef.current) {
      return;
    }

    const elapsedMs = Date.now() - startedAtRef.current;
    const confusedModule = getMostConfusedMisconceptionTitle();
    const nextReport = {
      elapsedMs,
      mistakeCount: mistakeCountRef.current,
      confusedModule,
    };

    setReport(nextReport);
    recordFinalChallenge(nextReport);
    void markLevelCompleted(
      'challenge:final-transformer-flow',
      Math.max(0, 100 - mistakeCountRef.current * 10),
      nextReport,
      '最终综合挑战',
    ).catch((error) => {
      console.warn('Supabase final challenge save failed.', error);
    });
    setAchievementToastItems(unlockAchievement('final-challenger'));
    hasCompletedRef.current = true;
  }

  function handleRestart() {
    setRunId(Date.now());
    setReport(undefined);
    startedAtRef.current = Date.now();
    mistakeCountRef.current = 0;
    hasCompletedRef.current = false;
  }

  return (
    <main className="game-page">
      <header className="game-header">
        <div>
          <p className="screen-label">最终综合挑战</p>
          <h1>重建 TransBot 的完整线路</h1>
          <p className="intro-text">一次接通完整 Transformer 流程。</p>
        </div>
        <div className="game-header-actions">
          <PixelButton onClick={handleRestart}>重新随机布局</PixelButton>
          <PixelButton onClick={() => onNavigate('home')}>返回主页</PixelButton>
        </div>
      </header>

      <TransformerFlowLab
        levelId={levelId}
        levelTitle="最终挑战"
        mission={finalChallengeMission}
        mode="campaign"
        onBackHome={() => onNavigate('home')}
        onComplete={handleComplete}
        onMistake={handleMistake}
        randomizeInitialLayout
        targetSequence={finalChallengeSequence}
      />

      {report ? (
        <section className="final-report" aria-label="最终挑战总结报告">
          <p className="screen-label">学习总结报告</p>
          <h2>完整流程已接通</h2>
          <div className="final-report-grid">
            <span>用时：{formatDuration(report.elapsedMs)}</span>
            <span>错误次数：{report.mistakeCount}</span>
            <span>最容易混淆：{report.confusedModule}</span>
          </div>
          <div className="complete-explain-card">
            <strong>你现在可以这样解释给别人听</strong>
            <span>{finalChallengeMission.explainToOthers}</span>
          </div>
          <p>想继续巩固，可以去自由练习里专门练最容易混淆的部分。</p>
          <div className="complete-actions">
            <PixelButton onClick={handleRestart}>再挑战一次</PixelButton>
            <PixelButton onClick={() => onNavigate('practice')}>去自由练习</PixelButton>
          </div>
        </section>
      ) : null}

      <AchievementToast achievements={achievementToastItems} onDismiss={() => setAchievementToastItems([])} />
    </main>
  );
}
