import { useMemo, useState } from 'react';
import { InterpreterChoicePanel, type InterpreterChoice } from '../components/interpreter/InterpreterChoicePanel';
import { InterpreterModuleMap } from '../components/interpreter/InterpreterModuleMap';
import '../components/interpreter/interpreterMode.css';
import { PixelButton } from '../components/PixelButton';
import type { PageId } from '../types/navigation';
import { tokenizeForTeaching } from '../utils/teachingTokenizer';

const defaultSentences = [
  '小猫看见小狗，因为它很害怕。',
  '我喜欢翻译，也喜欢把复杂句慢慢拆开。',
  '这本书虽然很难，但它很有价值。',
];

interface SentenceProfile {
  tokens: string[];
  grammarNotes: string[];
  tokenNote: string;
}

const interpreterChoices: InterpreterChoice[] = [
  {
    id: 'token',
    label: '先切分词块',
    moduleNames: ['Token'],
    explanation: '对应 Token：先把连续原文切成小单位。',
    contrast: 'Token 只是在问“句子先分成哪些块”；语法分析才继续问“谁做什么、为什么、它指谁”。',
  },
  {
    id: 'position',
    label: '判断语序',
    moduleNames: ['Position Encoding'],
    explanation: '对应 Position Encoding：提醒模型谁在前、谁在后。',
    contrast: '语法分析会解释关系，位置标记先保留顺序线索，避免“小猫看见小狗”和“小狗看见小猫”被看成一样。',
  },
  {
    id: 'attention',
    label: '找上下文重点',
    moduleNames: ['Self-Attention'],
    explanation: '对应 Self-Attention：让词回看整句话。',
    contrast: 'Token 把句子切开，Attention 会在切开的片段之间找关系，比如判断“它”要回看前面的哪个词。',
  },
  {
    id: 'multi-head',
    label: '多角度理解句子',
    moduleNames: ['Multi-Head Attention'],
    explanation: '对应 Multi-Head Attention：从多个角度同时审句。',
    contrast: '整句语法分析常常不止一个角度：有人看主谓宾，有人看因果，有人看指代，多头注意力像同时开几条观察线。',
  },
  {
    id: 'output',
    label: '组织输出表达',
    moduleNames: ['Feed Forward', 'Output'],
    explanation: '对应 Feed Forward 和 Output：继续加工理解，并准备输出。',
    contrast: '输出不是跳过理解直接写答案，而是在前面切分、顺序、上下文关系都处理后，再组织表达。',
  },
];

const sentenceProfiles: Record<string, SentenceProfile> = {
  '小猫看见小狗，因为它很害怕。': {
    tokens: ['小猫', '看见', '小狗', '，', '因为', '它', '很', '害怕', '。'],
    grammarNotes: [
      '主语：小猫',
      '动作：看见',
      '对象：小狗',
      '连接关系：因为 引出原因',
      '指代疑问：它 需要回看上下文判断',
    ],
    tokenNote: 'Token 拆分先得到“小猫 / 看见 / 小狗 / 因为 / 它”等片段，但还没有判断“它”到底指谁。',
  },
  '我喜欢翻译，也喜欢把复杂句慢慢拆开。': {
    tokens: ['我', '喜欢', '翻译', '，', '也', '喜欢', '把', '复杂句', '慢慢', '拆开', '。'],
    grammarNotes: [
      '主语：我',
      '并列动作：喜欢翻译 / 喜欢拆开',
      '对象：翻译、复杂句',
      '结构线索：把 字结构强调“复杂句”被拆开',
      '语气节奏：也 表示前后动作并列',
    ],
    tokenNote: 'Token 拆分保留“也”“把”“慢慢”这些小线索，后面模块才能继续判断并列和动作对象。',
  },
  '这本书虽然很难，但它很有价值。': {
    tokens: ['这本书', '虽然', '很难', '，', '但', '它', '很有价值', '。'],
    grammarNotes: [
      '话题：这本书',
      '让步关系：虽然 很难',
      '转折关系：但 很有价值',
      '指代关系：它 回看 这本书',
      '整句重点：难度高，但价值仍然高',
    ],
    tokenNote: 'Token 拆分能把“虽然 / 但 / 它”留下来；语法分析会进一步看出让步、转折和指代关系。',
  },
};

function splitCustomSentence(sentence: string) {
  return tokenizeForTeaching(sentence);
}

function getSentenceProfile(sentence: string): SentenceProfile {
  const trimmedSentence = sentence.trim();

  if (!trimmedSentence) {
    return {
      tokens: [],
      grammarNotes: ['先输入一句话，再观察它能被拆成哪些片段。'],
      tokenNote: '这里会显示 Token 拆分和译员式语法分析的区别。',
    };
  }

  const knownProfile = sentenceProfiles[trimmedSentence];

  if (knownProfile) {
    return knownProfile;
  }

  return {
    tokens: splitCustomSentence(trimmedSentence),
    grammarNotes: [
      '先找“谁”：句子里的主角或话题。',
      '再找“做什么”：主要动作、状态或判断。',
      '再看连接词：因为、但是、虽然、如果、也 等。',
      '最后看代词：它、他、这、那 需要回看上下文。',
    ],
    tokenNote: '自定义句子先做教学版拆分：尽量保留常见词块和功能词。真实模型的 Token 化可能更细，但核心都是先把连续文字变成可处理片段。',
  };
}

interface InterpreterModePageProps {
  onNavigate: (page: PageId) => void;
}

export function InterpreterModePage({ onNavigate }: InterpreterModePageProps) {
  const [sentenceIndex, setSentenceIndex] = useState(0);
  const [sentence, setSentence] = useState(defaultSentences[0]);
  const [selectedChoiceId, setSelectedChoiceId] = useState(interpreterChoices[0].id);
  const selectedChoice = useMemo(
    () => interpreterChoices.find((choice) => choice.id === selectedChoiceId) ?? interpreterChoices[0],
    [selectedChoiceId],
  );
  const sentenceProfile = useMemo(() => getSentenceProfile(sentence), [sentence]);

  function handleTryAnotherSentence() {
    const nextIndex = (sentenceIndex + 1) % defaultSentences.length;
    setSentenceIndex(nextIndex);
    setSentence(defaultSentences[nextIndex]);
    setSelectedChoiceId(interpreterChoices[0].id);
  }

  return (
    <main className="interpreter-page">
      <header className="interpreter-header">
        <div>
          <p className="screen-label">译员视角</p>
          <h1>从一句话读懂 Transformer</h1>
          <p>选一个译员动作，看它对应哪个模块。</p>
        </div>
        <PixelButton onClick={() => onNavigate('home')}>返回主页</PixelButton>
      </header>

      <section className="interpreter-workbench">
        <div className="interpreter-left-column">
          <section className="interpreter-input-panel" aria-label="输入句子区域">
            <label htmlFor="interpreter-sentence">原文句子</label>
            <textarea
              id="interpreter-sentence"
              onChange={(event) => setSentence(event.target.value)}
              value={sentence}
            />
            <div className="interpreter-sentence-tools">
              <PixelButton onClick={handleTryAnotherSentence}>再试一句</PixelButton>
              <PixelButton onClick={() => setSentence('')}>清空句子</PixelButton>
            </div>
          </section>

          <InterpreterChoicePanel
            choices={interpreterChoices}
            onSelect={setSelectedChoiceId}
            selectedChoiceId={selectedChoiceId}
          />
        </div>

        <div className="interpreter-right-column">
          <InterpreterModuleMap highlightedModuleNames={selectedChoice.moduleNames} />
          <section className="interpreter-explanation" aria-live="polite">
            <p className="screen-label">一句话解释</p>
            <h2>{selectedChoice.label}</h2>
            <p>{selectedChoice.explanation}</p>
            <div className="interpreter-analysis-grid">
              <div className="interpreter-analysis-card">
                <strong>Token 拆分结果</strong>
                {sentenceProfile.tokens.length > 0 ? (
                  <div className="interpreter-token-list" aria-label="Token 拆分结果">
                    {sentenceProfile.tokens.map((token, index) => (
                      <span key={`${token}-${index}`}>{token}</span>
                    ))}
                  </div>
                ) : (
                  <p>请先输入一句中文。</p>
                )}
                <p>{sentenceProfile.tokenNote}</p>
              </div>

              <div className="interpreter-analysis-card">
                <strong>整句话语法分析</strong>
                <ul>
                  {sentenceProfile.grammarNotes.map((note) => (
                    <li key={note}>{note}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="interpreter-contrast-note">
              <strong>对比理解</strong>
              <p>{selectedChoice.contrast}</p>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
