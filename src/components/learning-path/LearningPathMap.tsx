import './learningPath.css';

const WORKSHOP_PROGRESS_KEY = 'transformer-workshop-progress';

interface LearningPathStep {
  id: string;
  title: string;
  shortLabel: string;
  detail: string;
}

const learningPathSteps: LearningPathStep[] = [
  {
    id: 'input',
    title: '读入文字',
    shortLabel: '原文入口',
    detail: '先让模型看到一句话。',
  },
  {
    id: 'embedding',
    title: '变成语义',
    shortLabel: '语义卡片',
    detail: '把词块变成可计算的表示。',
  },
  {
    id: 'position',
    title: '记住顺序',
    shortLabel: '语序标记',
    detail: '告诉模型谁在前、谁在后。',
  },
  {
    id: 'attention',
    title: '回看上下文',
    shortLabel: '上下文重点',
    detail: '判断哪些词更值得关注。',
  },
  {
    id: 'multi-view',
    title: '多角度理解',
    shortLabel: '多头审句',
    detail: '从语法、指代、语气等角度一起看。',
  },
  {
    id: 'output',
    title: '加工输出',
    shortLabel: '组织表达',
    detail: '把理解加工成输出预测。',
  },
];

function loadCurrentLearningStepIndex() {
  if (typeof window === 'undefined') {
    return 0;
  }

  try {
    const progress = JSON.parse(window.localStorage.getItem(WORKSHOP_PROGRESS_KEY) ?? '{}') as {
      highestUnlockedLevelIndex?: number;
      levelIndex?: number;
    };
    const unlockedIndex =
      typeof progress.highestUnlockedLevelIndex === 'number'
        ? progress.highestUnlockedLevelIndex
        : typeof progress.levelIndex === 'number'
          ? progress.levelIndex
          : 0;

    return Math.min(Math.max(unlockedIndex, 0), learningPathSteps.length - 1);
  } catch {
    return 0;
  }
}

interface LearningPathMapProps {
  compact?: boolean;
}

export function LearningPathMap({ compact = false }: LearningPathMapProps) {
  const currentStepIndex = loadCurrentLearningStepIndex();

  return (
    <section className={compact ? 'learning-path learning-path-compact' : 'learning-path'} aria-label="学习路线图">
      <div className="learning-path-heading">
        <div>
          <p className="screen-label">学习路线图</p>
          <h2>我现在学到哪了？</h2>
        </div>
        <span>读入文字 → 变成语义 → 记住顺序 → 回看上下文 → 多角度理解 → 加工输出</span>
      </div>

      <ol className="learning-path-steps">
        {learningPathSteps.map((step, index) => {
          const status = index < currentStepIndex ? 'done' : index === currentStepIndex ? 'current' : 'locked';

          return (
            <li className={`learning-path-step is-${status}`} key={step.id}>
              <span className="learning-path-dot">{index + 1}</span>
              <div>
                <strong>{step.title}</strong>
                <small>{step.shortLabel}</small>
                {!compact ? <p>{step.detail}</p> : null}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
