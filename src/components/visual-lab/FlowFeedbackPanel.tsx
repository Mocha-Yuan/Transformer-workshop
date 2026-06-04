import { useState } from 'react';
import type { Misconception } from '../../data/misconceptions';
import { visualNodeMeta } from '../../data/visualNodeMeta';
import { useI18n } from '../../i18n/I18nProvider';
import type { GameMode, LevelMission } from '../../types/game';
import { AttentionMiniMap } from './AttentionMiniMap';

interface FlowFeedbackPanelProps {
  feedbackMessage: string;
  levelTitle: string;
  misconception?: Misconception;
  mission?: LevelMission;
  mode: GameMode;
  nextStepText?: string;
  onCollapse: () => void;
  progressText: string;
  selectedModuleName?: string;
  showAttentionMatrix: boolean;
  targetSequence: string[];
  wrongAttemptCount: number;
}

interface AttentionExample {
  sentenceParts: Array<{
    text: string;
    candidateId?: string;
    isPronoun?: boolean;
  }>;
  question: string;
  actionLabel: string;
  candidates: Array<{
    id: string;
    label: string;
    reason: string;
    isAnswer?: boolean;
  }>;
  answer: string;
}

const tokenPieces = ['我', '喜欢', '机器翻译'];
const englishTokenPieces = ['I', 'like', 'machine translation'];

const attentionExamples: AttentionExample[] = [
  {
    sentenceParts: [
      { text: '小猫', candidateId: 'cat' },
      { text: '躲进' },
      { text: '沙发下', candidateId: 'sofa' },
      { text: '，因为' },
      { text: '它', isPronoun: true },
      { text: '害怕陌生人' },
    ],
    question: '“它”指谁？',
    actionLabel: '演示“它”怎么回看',
    candidates: [
      { id: 'cat', label: '小猫', reason: '会害怕陌生人的更可能是小猫。', isAnswer: true },
      { id: 'sofa', label: '沙发下', reason: '这是地点，不太像“害怕”的主体。' },
    ],
    answer: 'Attention 会让“它”回头看“小猫”和“沙发下”，再把更有用的线索权重调高。',
  },
  {
    sentenceParts: [
      { text: '妈妈' },
      { text: '把' },
      { text: '蛋糕', candidateId: 'cake' },
      { text: '放进' },
      { text: '冰箱', candidateId: 'fridge' },
      { text: '，因为' },
      { text: '它', isPronoun: true },
      { text: '会融化' },
    ],
    question: '“它”指蛋糕还是冰箱？',
    actionLabel: '演示“它”找线索',
    candidates: [
      { id: 'cake', label: '蛋糕', reason: '会融化的是蛋糕。', isAnswer: true },
      { id: 'fridge', label: '冰箱', reason: '冰箱是保存环境，不是会融化的东西。' },
    ],
    answer: 'Attention 会把“会融化”这个线索和前面的“蛋糕”联系得更紧。',
  },
  {
    sentenceParts: [
      { text: '译员', candidateId: 'translator' },
      { text: '查了' },
      { text: '术语表', candidateId: 'glossary' },
      { text: '，因为' },
      { text: '它', isPronoun: true },
      { text: '能解释专业词' },
    ],
    question: '“它”指谁？',
    actionLabel: '演示“它”参考上下文',
    candidates: [
      { id: 'translator', label: '译员', reason: '译员会查资料，但“解释专业词”的工具更像术语表。' },
      { id: 'glossary', label: '术语表', reason: '术语表能解释专业词。', isAnswer: true },
    ],
    answer: 'Attention 不只看离“它”最近的词，还会看哪个上下文更能解释当前词。',
  },
  {
    sentenceParts: [
      { text: '学生', candidateId: 'student' },
      { text: '修改' },
      { text: '译文', candidateId: 'translation' },
      { text: '，因为' },
      { text: '它', isPronoun: true },
      { text: '不够通顺' },
    ],
    question: '“它”指学生还是译文？',
    actionLabel: '演示“它”回看谁',
    candidates: [
      { id: 'student', label: '学生', reason: '学生可以修改，但“不够通顺”通常评价文本。' },
      { id: 'translation', label: '译文', reason: '不够通顺的是译文。', isAnswer: true },
    ],
    answer: 'Attention 会把“它”和“译文”连得更强，因为后面的描述更匹配文本。',
  },
  {
    sentenceParts: [
      { text: '老师', candidateId: 'teacher' },
      { text: '表扬' },
      { text: '小明', candidateId: 'xiaoming' },
      { text: '，因为' },
      { text: '他', isPronoun: true },
      { text: '翻译得很准确' },
    ],
    question: '“他”指谁？',
    actionLabel: '演示“他”找对象',
    candidates: [
      { id: 'teacher', label: '老师', reason: '老师在表扬别人，不是被表扬的原因主体。' },
      { id: 'xiaoming', label: '小明', reason: '翻译准确的是被表扬的小明。', isAnswer: true },
    ],
    answer: 'Attention 会根据“翻译得很准确”回看更相关的“小明”。',
  },
];

type TeachingAnimation = 'token' | 'attention';

function getNextExampleIndex(currentIndex: number) {
  if (attentionExamples.length <= 1) {
    return currentIndex;
  }

  let nextIndex = Math.floor(Math.random() * attentionExamples.length);

  while (nextIndex === currentIndex) {
    nextIndex = Math.floor(Math.random() * attentionExamples.length);
  }

  return nextIndex;
}

function TeachingAnimationPanel() {
  const { language, t } = useI18n();
  const [animation, setAnimation] = useState<TeachingAnimation>('token');
  const [isTokenSplit, setIsTokenSplit] = useState(false);
  const [attentionExampleIndex, setAttentionExampleIndex] = useState(0);
  const [showAttentionReasoning, setShowAttentionReasoning] = useState(false);
  const attentionExample = attentionExamples[attentionExampleIndex];

  function handleChangeAttentionExample() {
    setAttentionExampleIndex((currentIndex) => getNextExampleIndex(currentIndex));
    setShowAttentionReasoning(false);
  }

  return (
    <section className="flow-panel-card teaching-animation-card">
      <p className="screen-label">{t('小演示')}</p>
      <div className="teaching-animation-tabs" aria-label={t('教学动画选择')}>
        <button
          className={animation === 'token' ? 'mini-panel-button is-active' : 'mini-panel-button'}
          onClick={() => setAnimation('token')}
          type="button"
        >
          Token
        </button>
        <button
          className={animation === 'attention' ? 'mini-panel-button is-active' : 'mini-panel-button'}
          onClick={() => setAnimation('attention')}
          type="button"
        >
          Attention
        </button>
      </div>

      {animation === 'token' ? (
        <div className="token-teaching-stage">
          <div className={isTokenSplit ? 'token-sentence is-split' : 'token-sentence'}>
            {isTokenSplit
              ? (language === 'en' ? englishTokenPieces : tokenPieces).map((piece) => <span key={piece}>{piece}</span>)
              : <strong>{language === 'en' ? 'I like machine translation' : '我喜欢机器翻译'}</strong>}
          </div>
          <button className="mini-panel-button" onClick={() => setIsTokenSplit((current) => !current)} type="button">
            {t(isTokenSplit ? '合回原句' : '切成 Token')}
          </button>
          <p>{t('看动作：整句先变成小片段。')}</p>
        </div>
      ) : (
        <div className="attention-teaching-stage">
          <div className="attention-story-card">
            <p className="attention-demo-label">{t('先读这句话')}</p>
            <div className="attention-demo-sentence" aria-label={t('注意力演示句子')}>
              {attentionExample.sentenceParts.map((part, index) => {
                const answerCandidate = attentionExample.candidates.find(
                  (candidate) => candidate.id === part.candidateId && candidate.isAnswer,
                );
                const isCandidate = Boolean(part.candidateId);
                const className = [
                  part.isPronoun ? 'is-pronoun' : '',
                  showAttentionReasoning && isCandidate ? 'is-candidate' : '',
                  showAttentionReasoning && answerCandidate ? 'is-answer' : '',
                ]
                  .filter(Boolean)
                  .join(' ');

                return (
                  <span className={className || undefined} key={`${part.text}-${index}`}>
                    {t(part.text)}
                  </span>
                );
              })}
            </div>
            <div className="attention-question">
              <strong>{t('问题：')}</strong>
              <span>{t(attentionExample.question)}</span>
            </div>
          </div>

          <div className="attention-example-tools">
            <button
              className="mini-panel-button"
              onClick={() => setShowAttentionReasoning((current) => !current)}
              type="button"
            >
              {showAttentionReasoning ? t('收起回看过程') : t(attentionExample.actionLabel)}
            </button>
            <button className="mini-panel-button" onClick={handleChangeAttentionExample} type="button">
              {t('换一个')}
            </button>
          </div>

          {showAttentionReasoning ? (
            <div className="attention-reasoning" aria-live="polite">
              {attentionExample.candidates.map((candidate, index) => (
                <div className={candidate.isAnswer ? 'attention-candidate is-strong' : 'attention-candidate'} key={candidate.id}>
                  <span>{language === 'en' ? `Candidate ${index + 1}` : `候选 ${index + 1}`}</span>
                  <strong>{t(candidate.label)}</strong>
                  <p>{t(candidate.reason)}</p>
                </div>
              ))}
              <p className="attention-answer">{t(attentionExample.answer)}</p>
            </div>
          ) : (
            <p>{t('先别看线，先问一句：这个词需要回头找哪条线索？')}</p>
          )}
        </div>
      )}
    </section>
  );
}

export function FlowFeedbackPanel({
  feedbackMessage,
  levelTitle,
  misconception,
  mission,
  mode,
  nextStepText,
  onCollapse,
  progressText,
  selectedModuleName,
  showAttentionMatrix,
  targetSequence,
  wrongAttemptCount,
}: FlowFeedbackPanelProps) {
  const { t } = useI18n();
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isMisconceptionOpen, setIsMisconceptionOpen] = useState(false);
  const selectedMeta = visualNodeMeta.find((meta) => meta.moduleName === selectedModuleName);

  return (
    <aside className="visual-lab-feedback" aria-label={t('连接反馈和教学说明')}>
      <div className="visual-feedback-panel-actions">
        <button className="mini-panel-button" onClick={onCollapse} type="button">
          {t('收起说明')}
        </button>
      </div>

      <section className="flow-panel-card">
        <p className="screen-label">{t('当前任务')}</p>
        <h2>{t(mission?.missionTitle ?? levelTitle)}</h2>
        <small>{t(mode === 'practice' ? '自由练习' : '闯关模式')}</small>
        {mission ? (
          <>
            <strong>{t('今日只学一句')}</strong>
            <p>{t(mission.todayLesson)}</p>
            <strong>{t('操作目标')}</strong>
            <p>{t(mission.missionBrief)}</p>
          </>
        ) : null}
        <span>{progressText}</span>
        <div className="visual-target-sequence" aria-label={t('目标连接顺序')}>
          {targetSequence.map((moduleName, index) => {
            const meta = visualNodeMeta.find((item) => item.moduleName === moduleName);

            return (
              <span key={`${moduleName}-${index}`}>
                {meta?.icon} {moduleName}
              </span>
            );
          })}
        </div>
      </section>

      <section className="flow-panel-card">
        <p className="screen-label">{t('下一步')}</p>
        <p className="visual-feedback-text">{t(nextStepText ?? feedbackMessage)}</p>
        {wrongAttemptCount > 0 ? (
          <div className="flow-error-ladder" aria-label={t('错误递进提示')}>
            <strong>{t('错误也能推进')}</strong>
            <span className={wrongAttemptCount >= 1 ? 'is-active' : undefined}>{t('1 TransBot 提醒可能跳过了哪一步')}</span>
            <span className={wrongAttemptCount >= 2 ? 'is-active' : undefined}>{t('2 画布高亮当前缺口')}</span>
            <span className={wrongAttemptCount >= 3 ? 'is-active' : undefined}>{t('3 半透明正确路径已展开，可先看答案演示')}</span>
          </div>
        ) : null}
      </section>

      {misconception ? (
        <section className="flow-panel-card misconception-card">
          <div className="misconception-card-heading">
            <p className="screen-label">{t('误区提示')}</p>
            <button
              className="mini-panel-button"
              onClick={() => setIsMisconceptionOpen((current) => !current)}
              type="button"
            >
              {t(isMisconceptionOpen ? '收起' : '看原因')}
            </button>
          </div>
          <h3>{t(misconception.title)}</h3>
          {isMisconceptionOpen ? (
            <>
              <strong>{t('为什么错')}</strong>
              <p>{t(misconception.explanation)}</p>
              <strong>{t('翻译类比')}</strong>
              <p>{t(misconception.mtiAnalogy)}</p>
              <strong>{t('下一步')}</strong>
              <p>{t(misconception.hint)}</p>
            </>
          ) : (
            <p>{t(misconception.hint)}</p>
          )}
        </section>
      ) : null}

      <TeachingAnimationPanel />

      <section className="flow-panel-card selected-node-card">
        <p className="screen-label">{t('当前模块')}</p>
        {selectedMeta ? (
          <>
            <h3>{t(selectedMeta.roleName)}</h3>
            <small>{selectedMeta.labelEn}</small>
            <p>{t(selectedMeta.oneLineLesson)}</p>
            <button className="mini-panel-button" onClick={() => setIsDetailOpen((current) => !current)} type="button">
              {t(isDetailOpen ? '收起解释' : '看详细解释')}
            </button>
            {isDetailOpen ? (
              <div className="selected-node-detail">
                <strong>{t('它在做什么')}</strong>
                <p>{t(selectedMeta.metaphor)}</p>
                <strong>{t('翻译类比')}</strong>
                <p>{t(selectedMeta.translatorAnalogy)}</p>
                <strong>{t('在 Transformer 中')}</strong>
                <p>{t(selectedMeta.transformerRole)}</p>
              </div>
            ) : null}
          </>
        ) : (
          <p>{t('点击一个模块节点，查看它当前负责什么。')}</p>
        )}
      </section>

      {showAttentionMatrix ? <AttentionMiniMap /> : null}

      <p className="visual-delete-tip">{t('提示：选中连线后按 Delete 或 Backspace 可以删除。')}</p>
    </aside>
  );
}
