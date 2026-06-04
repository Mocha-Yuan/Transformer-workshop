import { useMemo, useState } from 'react';
import {
  attentionRiddles,
  gameplayActivities,
  positionActivity,
  questChapters,
  type GameplayActivity,
} from '../../data/gameplayActivities';
import { useI18n } from '../../i18n/I18nProvider';
import type { CheckResult, GameLevel } from '../../types/game';

interface GameplayPanelProps {
  currentLevel: GameLevel;
  checkResult: CheckResult;
  mistakeCount: number;
  onStartDemo?: () => void;
}

const tokenChoices = [
  {
    id: 'good',
    label: '这本书 / 虽然 / 很难 / 但 / 它 / 很有价值',
    isCorrect: true,
    feedback: '这组切法保留了转折词和代词，后面更容易分析关系。',
  },
  {
    id: 'too-big',
    label: '这本书虽然很难 / 但它很有价值',
    isCorrect: false,
    feedback: '太粗了。“虽然、但、它”这些关键线索被包在一起了。',
  },
  {
    id: 'too-small',
    label: '这 / 本 / 书 / 虽 / 然 / 很 / 难',
    isCorrect: false,
    feedback: '太碎了。真实 Token 可能会很细，但学习时要先看见有意义的片段。',
  },
];

const qkvPairs = [
  { label: 'Query', answer: '我现在想知道什么？' },
  { label: 'Key', answer: '我能提供什么线索标签？' },
  { label: 'Value', answer: '真正取回的参考内容是什么？' },
];

const headTags = ['语法关系', '指代关系', '语气色彩', '逻辑连接'];

function getCoachLine(checkResult: CheckResult, mistakeCount: number) {
  if (checkResult.status === 'complete') {
    return 'TransBot：这次不是只连对线，而是修好了一段语言理解流程。';
  }

  if (checkResult.status === 'correct') {
    return 'TransBot：这一步很像译员先打草稿，不急着润色，先让理解路线走通。';
  }

  if (checkResult.status !== 'wrong') {
    return 'TransBot：先玩一个小任务，再去连线，会更容易知道自己为什么要接这个模块。';
  }

  if (mistakeCount <= 1) {
    return 'TransBot：你可能跳过了语义卡片。先想清楚“文字变成什么表示”。';
  }

  if (mistakeCount === 2) {
    return 'TransBot：我帮你缩小范围：看看黄色高亮的下一步，那里通常是缺失模块。';
  }

  return 'TransBot：线索已升级。可以点“先看答案演示”，看完系统会收起答案，再轮到你。';
}

function TokenActivity() {
  const { t } = useI18n();
  const [selectedId, setSelectedId] = useState<string>();
  const selectedChoice = tokenChoices.find((choice) => choice.id === selectedId);

  return (
    <div className="gameplay-activity">
      <p className="gameplay-sentence">{t('这本书虽然很难，但它很有价值。')}</p>
      <div className="gameplay-choice-grid">
        {tokenChoices.map((choice) => (
          <button
            className={selectedId === choice.id ? 'gameplay-choice is-selected' : 'gameplay-choice'}
            key={choice.id}
            onClick={() => setSelectedId(choice.id)}
            type="button"
          >
            {t(choice.label)}
          </button>
        ))}
      </div>
      {selectedChoice ? (
        <p className={selectedChoice.isCorrect ? 'gameplay-result is-correct' : 'gameplay-result is-wrong'}>
          {t(selectedChoice.feedback)}
        </p>
      ) : (
        <p className="gameplay-hint">{t('先选一种切法。目标不是语文考试，而是让模型拿到可处理的小片段。')}</p>
      )}
    </div>
  );
}

function PositionActivity() {
  const { t } = useI18n();
  const [selectedId, setSelectedId] = useState<string>();
  const options = [
    {
      id: 'cat-dog',
      label: '小猫看见小狗',
      feedback: '主角是小猫，动作对象是小狗。',
    },
    {
      id: 'dog-cat',
      label: '小狗看见小猫',
      feedback: '词没变，但主角和对象换了。语序会改变理解。',
    },
  ];
  const selected = options.find((option) => option.id === selectedId);

  return (
    <div className="gameplay-activity">
      <div className="gameplay-choice-grid">
        {options.map((option) => (
          <button
            className={selectedId === option.id ? 'gameplay-choice is-selected' : 'gameplay-choice'}
            key={option.id}
            onClick={() => setSelectedId(option.id)}
            type="button"
          >
            {t(option.label)}
          </button>
        ))}
      </div>
      <p className="gameplay-result">{t(selected?.feedback ?? '点击一句话，看看同样的词换顺序后意思怎么变。')}</p>
    </div>
  );
}

function QkvActivity() {
  const { t } = useI18n();
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="gameplay-activity">
      <div className="qkv-match-grid">
        {qkvPairs.map((pair) => (
          <div className="qkv-match-card" key={pair.label}>
            <strong>{pair.label}</strong>
            <span>{t(revealed ? pair.answer : '点击下方揭晓')}</span>
          </div>
        ))}
      </div>
      <button className="mini-panel-button" onClick={() => setRevealed((current) => !current)} type="button">
        {t(revealed ? '收起答案' : '揭晓配对')}
      </button>
    </div>
  );
}

function AttentionActivity() {
  const { t, language } = useI18n();
  const [riddleIndex, setRiddleIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>();
  const riddle = attentionRiddles[riddleIndex];
  const hasAnswered = Boolean(selectedAnswer);
  const isCorrect = selectedAnswer === riddle.answer;

  function handleNextRiddle() {
    setRiddleIndex((current) => (current + 1) % attentionRiddles.length);
    setSelectedAnswer(undefined);
  }

  return (
    <div className="gameplay-activity">
      <p className="gameplay-sentence">{t(riddle.sentence)}</p>
      <strong className="gameplay-question">{t(riddle.question)}</strong>
      <div className="gameplay-choice-grid">
        {riddle.options.map((option) => (
          <button
            className={selectedAnswer === option ? 'gameplay-choice is-selected' : 'gameplay-choice'}
            key={option}
            onClick={() => setSelectedAnswer(option)}
            type="button"
          >
            {t(option)}
          </button>
        ))}
      </div>
      {hasAnswered ? (
        <div className={isCorrect ? 'gameplay-result is-correct' : 'gameplay-result is-wrong'}>
          <strong>{isCorrect ? t('猜对了') : language === 'en' ? `Almost. The answer is: ${t(riddle.answer)}` : `还差一点，答案是：${riddle.answer}`}</strong>
          <span>{t(riddle.clue)}</span>
          <span>{t(riddle.explanation)}</span>
        </div>
      ) : (
        <p className="gameplay-hint">{t('先猜，再看 Attention 为什么要回看上下文。')}</p>
      )}
      <button className="mini-panel-button" onClick={handleNextRiddle} type="button">
        {t('换一个谜题')}
      </button>
    </div>
  );
}

function MultiHeadActivity() {
  const { t } = useI18n();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const isComplete = selectedTags.length === headTags.length;

  function toggleTag(tag: string) {
    setSelectedTags((current) => (current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag]));
  }

  return (
    <div className="gameplay-activity">
      <p className="gameplay-sentence">{t('虽然句子很长，但译员仍要判断它的结构、指代、语气和逻辑。')}</p>
      <div className="gameplay-choice-grid">
        {headTags.map((tag) => (
          <button
            className={selectedTags.includes(tag) ? 'gameplay-choice is-selected' : 'gameplay-choice'}
            key={tag}
            onClick={() => toggleTag(tag)}
            type="button"
          >
            {t(tag)}
          </button>
        ))}
      </div>
      <p className={isComplete ? 'gameplay-result is-correct' : 'gameplay-result'}>
        {t(isComplete ? '四个观察角度都开了：这就是“多头不是重复看，而是分工看”。' : '试着把四个观察角度都点亮。')}
      </p>
    </div>
  );
}

function OutputActivity() {
  const { t } = useI18n();
  const [selectedId, setSelectedId] = useState<string>();
  const options = [
    { id: 'literal', label: '这本书很难，但是它有价值。', isCorrect: true },
    { id: 'wrong-ref', label: '这本书很难，所以小猫很有价值。', isCorrect: false },
    { id: 'skip', label: '它会融化，所以放进冰箱。', isCorrect: false },
  ];
  const selected = options.find((option) => option.id === selectedId);

  return (
    <div className="gameplay-activity">
      <p className="gameplay-sentence">{t('原文：这本书虽然很难，但它很有价值。')}</p>
      <div className="gameplay-choice-grid">
        {options.map((option) => (
          <button
            className={selectedId === option.id ? 'gameplay-choice is-selected' : 'gameplay-choice'}
            key={option.id}
            onClick={() => setSelectedId(option.id)}
            type="button"
          >
            {t(option.label)}
          </button>
        ))}
      </div>
      {selected ? (
        <p className={selected.isCorrect ? 'gameplay-result is-correct' : 'gameplay-result is-wrong'}>
          {t(selected.isCorrect ? '输出保留了转折和指代，适合作为结果。' : '这句丢失或混乱了前面的理解线索。')}
        </p>
      ) : null}
    </div>
  );
}

function ActivityBody({ kind }: { kind: GameplayActivity['kind'] }) {
  if (kind === 'token') {
    return <TokenActivity />;
  }

  if (kind === 'position') {
    return <PositionActivity />;
  }

  if (kind === 'qkv') {
    return <QkvActivity />;
  }

  if (kind === 'attention') {
    return <AttentionActivity />;
  }

  if (kind === 'multi-head') {
    return <MultiHeadActivity />;
  }

  return <OutputActivity />;
}

export function GameplayPanel({ currentLevel, checkResult, mistakeCount, onStartDemo }: GameplayPanelProps) {
  const { t } = useI18n();
  const quest = questChapters.find((chapter) => chapter.levelId === currentLevel.id) ?? questChapters[0];
  const primaryActivity = gameplayActivities[currentLevel.id] ?? gameplayActivities['text-enters-model'];
  const activities = useMemo(() => {
    if (currentLevel.id === 'text-enters-model') {
      return [primaryActivity, positionActivity];
    }

    return [primaryActivity];
  }, [currentLevel.id, primaryActivity]);
  const [activeActivityId, setActiveActivityId] = useState(activities[0].id);
  const activeActivity = activities.find((activity) => activity.id === activeActivityId) ?? activities[0];

  return (
    <section className="gameplay-panel" aria-label={t('关卡玩法任务')}>
      <div className="gameplay-side-column">
        <div className="gameplay-quest-card">
          <p className="screen-label">{t('翻译任务')}</p>
          <h2>{t(quest.chapter)}</h2>
          <p>{t(quest.brief)}</p>
          <span>{t(quest.reward)}</span>
        </div>

        <div className="gameplay-coach-card">
          <p className="screen-label">{t('TransBot 陪练')}</p>
          <p>{t(getCoachLine(checkResult, mistakeCount))}</p>
          {mistakeCount >= 3 && onStartDemo ? (
            <button className="mini-panel-button" onClick={onStartDemo} type="button">
              {t('看一次演示')}
            </button>
          ) : null}
        </div>
      </div>

      <div className="gameplay-task-card">
        <div className="gameplay-task-heading">
          <div>
            <p className="screen-label">{t('玩法小任务')}</p>
            <h2>{t(activeActivity.title)}</h2>
            <span>{t(activeActivity.goal)}</span>
          </div>
          {activities.length > 1 ? (
            <div className="gameplay-tabs" aria-label={t('切换玩法任务')}>
              {activities.map((activity) => (
                <button
                  className={activity.id === activeActivity.id ? 'mini-panel-button is-active' : 'mini-panel-button'}
                  key={activity.id}
                  onClick={() => setActiveActivityId(activity.id)}
                  type="button"
                >
                  {activity.kind === 'token' ? 'Token' : 'Position'}
                </button>
              ))}
            </div>
          ) : null}
        </div>
        <ActivityBody kind={activeActivity.kind} />
      </div>
    </section>
  );
}
