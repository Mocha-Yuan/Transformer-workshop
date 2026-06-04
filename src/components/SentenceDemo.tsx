import { useEffect, useMemo, useState } from 'react';
import { useI18n } from '../i18n/I18nProvider';
import type { Language } from '../i18n/translations';
import type { DemoResult, DemoToken } from '../types/demo';
import { tokenizeForTeaching } from '../utils/teachingTokenizer';
import { PixelButton } from './PixelButton';

const defaultSentenceByLanguage: Record<Language, string> = {
  zh: '我喜欢学习翻译',
  en: 'I enjoy learning translation',
};
const stepTitlesByLanguage: Record<Language, string[]> = {
  zh: ['原始句子', '切成片段', '语义卡片', '保留语序', '判断重点', '模拟输出'],
  en: ['Original sentence', 'Split into chunks', 'Semantic cards', 'Keep order', 'Find focus', 'Simulated output'],
};
const connectorWords = ['因为', '所以', '但是', '但', '虽然', '如果', '也', '并且'];
const englishConnectorWords = ['because', 'so', 'but', 'although', 'if', 'also', 'and'];
const pronounWords = ['它', '他', '她', '这', '那', '他们', '它们'];
const englishPronounWords = ['it', 'he', 'she', 'this', 'that', 'they', 'them'];
const punctuationPattern = /^[，。！？；、,.!?;:]$/;

type TaskId = 'token' | 'position' | 'pronoun' | 'connector' | 'focus';

interface SentenceTask {
  id: TaskId;
  title: string;
  summary: string;
  explanation: string;
  stepIndex: number;
}

function createEmbedding(token: string, position: number) {
  const codePoint = token.codePointAt(0) ?? 1;

  return [0, 1, 2].map((dimension) => {
    const value = ((codePoint + position * 13 + dimension * 17) % 10) / 10;
    return Number(value.toFixed(1));
  });
}

function tokenizeSentence(sentence: string): DemoToken[] {
  return tokenizeForTeaching(sentence).map((token, index) => ({
    text: token,
    embedding: createEmbedding(token, index),
    position: index + 1,
  }));
}

function createDemoResult(sentence: string): DemoResult {
  const normalizedSentence = sentence.trim();

  return {
    sentence: normalizedSentence,
    tokens: tokenizeSentence(normalizedSentence),
  };
}

function pickImportantTokens(tokens: DemoToken[]) {
  return tokens
    .filter((token) => !punctuationPattern.test(token.text))
    .slice(0, 5)
    .map((token) => token.text);
}

function findTokenMatches(tokens: DemoToken[], words: string[]) {
  const normalizedWords = new Set(words.map((word) => word.toLowerCase()));

  return tokens.map((token) => token.text).filter((tokenText) => normalizedWords.has(tokenText.toLowerCase()));
}

function formatTokenList(tokens: DemoToken[], language: Language) {
  return tokens.length > 0
    ? tokens.map((token) => token.text).join(' / ')
    : language === 'en'
      ? 'Enter a sentence first.'
      : '先输入一句中文。';
}

function describeToken(token: DemoToken | undefined, language: Language) {
  if (!token) {
    return language === 'en'
      ? 'Click a Token to see its teaching explanation in this sentence.'
      : '点击一个 Token，可以看到它在这句话里的教学解释。';
  }

  if (punctuationPattern.test(token.text)) {
    if (language === 'en') {
      return `"${token.text}" is punctuation. It preserves sentence boundaries and pauses.`;
    }

    return `“${token.text}” 是标点，也会保留句子边界和停顿线索。`;
  }

  if (findTokenMatches([token], language === 'en' ? englishConnectorWords : connectorWords).length > 0) {
    if (language === 'en') {
      return `"${token.text}" is a connector. It often signals cause, contrast, condition, or coordination.`;
    }

    return `“${token.text}” 是连接词，常常提示因果、转折或并列关系。`;
  }

  if (findTokenMatches([token], language === 'en' ? englishPronounWords : pronounWords).length > 0) {
    if (language === 'en') {
      return `"${token.text}" is a pronoun. Attention often needs to look back at context for it.`;
    }

    return `“${token.text}” 是代词，后面做 Attention 时通常要回看上下文。`;
  }

  if (/^[A-Za-z0-9]+$/.test(token.text)) {
    if (language === 'en') {
      return `"${token.text}" is kept as one teaching chunk before later processing.`;
    }

    return `“${token.text}” 是连续英文或数字片段，教学版会先把它作为一个整体。`;
  }

  if (language === 'en') {
    return `"${token.text}" is a teaching chunk. It is not the final meaning yet, just a small unit for later computation.`;
  }

  return `“${token.text}” 是教学版词块。它还不是“理解结果”，只是进入后续计算的小单位。`;
}

function createSentenceTasks(tokens: DemoToken[], language: Language): SentenceTask[] {
  const tokenSummary = formatTokenList(tokens, language);
  const positionSummary =
    tokens.length > 0
      ? tokens.map((token) => `${token.position}.${token.text}`).join('  ')
      : language === 'en'
        ? 'Enter a sentence first.'
        : '先输入一句中文。';
  const pronouns = findTokenMatches(tokens, language === 'en' ? englishPronounWords : pronounWords);
  const connectors = findTokenMatches(tokens, language === 'en' ? englishConnectorWords : connectorWords);
  const importantTokens = pickImportantTokens(tokens);

  if (language === 'en') {
    return [
      {
        id: 'token',
        title: 'Split into Tokens',
        summary: tokenSummary,
        explanation:
          tokens.length > 0
            ? 'This step only splits continuous text into processable chunks. It has not judged the sentence meaning yet.'
            : 'After you enter a sentence, the teaching Token split appears here in real time.',
        stepIndex: 1,
      },
      {
        id: 'position',
        title: 'Mark Word Order',
        summary: positionSummary,
        explanation: 'The same words can mean different things in a different order. Position clues preserve what comes before and after.',
        stepIndex: 3,
      },
      {
        id: 'pronoun',
        title: 'Find Pronoun Reference',
        summary: pronouns.length > 0 ? `${pronouns.join(', ')} need to look back at context.` : 'No obvious pronoun in this sentence yet.',
        explanation:
          pronouns.length > 0
            ? 'Pronouns cannot be understood alone. Attention lets them look back at candidate clues.'
            : 'Without an obvious pronoun, you can still inspect connectors and focus words.',
        stepIndex: 4,
      },
      {
        id: 'connector',
        title: 'Find Connectors',
        summary: connectors.length > 0 ? connectors.join(', ') : 'No obvious connector in this sentence yet.',
        explanation:
          connectors.length > 0
            ? 'Connectors signal cause, contrast, coordination, or conditions, and help identify context focus.'
            : 'Without an obvious connector, the model still uses meaning and position to find relationships.',
        stepIndex: 4,
      },
      {
        id: 'focus',
        title: 'Find Focus Words',
        summary: importantTokens.length > 0 ? importantTokens.join(', ') : 'Enter a fuller sentence first.',
        explanation: 'These are teaching candidates for focus words. Real Attention assigns different weights to every chunk.',
        stepIndex: 4,
      },
    ];
  }

  return [
    {
      id: 'token',
      title: '切成 Token',
      summary: tokenSummary,
      explanation:
        tokens.length > 0
          ? '这一步只负责把连续文字切成可处理片段，还没有判断整句话是什么意思。'
          : '输入一句话后，这里会实时显示教学版 Token 拆分。',
      stepIndex: 1,
    },
    {
      id: 'position',
      title: '标出语序',
      summary: positionSummary,
      explanation: '同样的词换顺序，意思可能会变。位置线索帮助模型保留“谁在前、谁在后”。',
      stepIndex: 3,
    },
    {
      id: 'pronoun',
      title: '找代词指向',
      summary: pronouns.length > 0 ? `${pronouns.join('、')} 需要回看上下文。` : '这句暂时没有明显代词。',
      explanation:
        pronouns.length > 0
          ? '代词不能孤立理解，Attention 会让它回头看前面的候选线索。'
          : '没有明显代词时，也可以继续看连接词和重点词。',
      stepIndex: 4,
    },
    {
      id: 'connector',
      title: '找连接词',
      summary: connectors.length > 0 ? connectors.join('、') : '这句暂时没有明显连接词。',
      explanation:
        connectors.length > 0
          ? '连接词会提示因果、转折、并列或条件关系，是判断上下文重点的重要线索。'
          : '没有明显连接词时，模型仍会根据词义和位置寻找关系。',
      stepIndex: 4,
    },
    {
      id: 'focus',
      title: '判断重点词',
      summary: importantTokens.length > 0 ? importantTokens.join('、') : '先输入更完整的句子。',
      explanation: '这些是教学版挑出的候选重点词。真实 Attention 会给每个片段分配不同权重。',
      stepIndex: 4,
    },
  ];
}

export function SentenceDemo() {
  const { language, t } = useI18n();
  const stepTitles = stepTitlesByLanguage[language];
  const [sentence, setSentence] = useState(defaultSentenceByLanguage[language]);
  const [activeStep, setActiveStep] = useState(0);
  const [activeTaskId, setActiveTaskId] = useState<TaskId>('token');
  const [selectedTokenIndex, setSelectedTokenIndex] = useState(0);
  const demoResult = useMemo(() => createDemoResult(sentence), [sentence]);
  const sentenceTasks = useMemo(() => createSentenceTasks(demoResult.tokens, language), [demoResult.tokens, language]);
  const activeTask = sentenceTasks.find((task) => task.id === activeTaskId) ?? sentenceTasks[0];
  const selectedToken = demoResult.tokens[selectedTokenIndex];

  useEffect(() => {
    setSentence((currentSentence) => {
      const otherLanguage = language === 'en' ? 'zh' : 'en';

      return currentSentence === defaultSentenceByLanguage[otherLanguage]
        ? defaultSentenceByLanguage[language]
        : currentSentence;
    });
  }, [language]);

  function handleResetDemo() {
    setActiveStep(0);
    setActiveTaskId('token');
    setSelectedTokenIndex(0);
  }

  function handleNextStep() {
    setActiveStep((currentStep) => Math.min(currentStep + 1, stepTitles.length - 1));
  }

  function handleSelectTask(task: SentenceTask) {
    setActiveTaskId(task.id);
    setActiveStep(task.stepIndex);
  }

  function handleSentenceChange(nextSentence: string) {
    setSentence(nextSentence);
    setSelectedTokenIndex(0);
  }

  const canShowStep = (stepIndex: number) => activeStep >= stepIndex;
  const isLastStep = activeStep === stepTitles.length - 1;

  return (
    <section className="sentence-demo" aria-label="句子进入 Transformer 互动演示">
      <div className="sentence-demo-header">
        <div>
          <p className="screen-label">迷你互动演示</p>
          <h2>句子进入 Transformer</h2>
          <p>输入一句中文，看看模型如何像译前分析一样：先切分，再保留语序，接着判断上下文重点。</p>
        </div>
        <div className="demo-progress" aria-label={`当前演示进度 ${activeStep + 1} / ${stepTitles.length}`}>
          {stepTitles.map((title, index) => (
            <button
              aria-label={`查看第 ${index + 1} 步：${title}`}
              className={index <= activeStep ? 'is-active' : ''}
              key={title}
              onClick={() => setActiveStep(index)}
              type="button"
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      <div className="sentence-demo-control">
        <label htmlFor="sentence-input">输入句子</label>
        <input
          id="sentence-input"
          onChange={(event) => handleSentenceChange(event.target.value)}
          type="text"
          value={sentence}
        />
        <PixelButton onClick={handleResetDemo}>重置演示</PixelButton>
      </div>

      {demoResult.tokens.length > 0 ? (
        <div className="demo-steps">
          {canShowStep(0) ? (
            <article className="demo-step">
              <span className="demo-step-index">01</span>
              <div>
                <h3>原始句子</h3>
                <p className="raw-sentence">{demoResult.sentence}</p>
              </div>
            </article>
          ) : null}

          {canShowStep(1) ? (
            <article className="demo-step">
              <span className="demo-step-index">02</span>
              <div>
                <h3>切成可处理的小片段</h3>
                <div className="token-row">
                  {demoResult.tokens.map((token, index) => (
                    <button
                      className={index === selectedTokenIndex ? 'token-chip is-selected' : 'token-chip'}
                      key={`${token.text}-${token.position}`}
                      onClick={() => {
                        setSelectedTokenIndex(index);
                        setActiveTaskId('token');
                      }}
                      type="button"
                    >
                      {token.text}
                    </button>
                  ))}
                </div>
                <p>{t('这里用教学版切分：优先保留常见词块和功能词。真实模型会更复杂，可能切成字、词或子词。')}</p>
                <div className="token-explain-card" aria-live="polite">
                  <strong>{selectedToken ? `Token ${selectedToken.position}` : 'Token 说明'}</strong>
                  <span>{describeToken(selectedToken, language)}</span>
                </div>
              </div>
            </article>
          ) : null}

          {canShowStep(2) ? (
            <article className="demo-step">
              <span className="demo-step-index">03</span>
              <div>
                <h3>每个片段变成语义卡片</h3>
                <div className="embedding-grid">
                  {demoResult.tokens.map((token) => (
                    <div className="embedding-card" key={`embedding-${token.text}-${token.position}`}>
                      <strong>{token.text}</strong>
                      <span>[{token.embedding.join(', ')}]</span>
                    </div>
                  ))}
                </div>
                <p>{t('这些小数字不是真实模型结果，只是模拟“模型把文字变成可计算的语义表示”。')}</p>
              </div>
            </article>
          ) : null}

          {canShowStep(3) ? (
            <article className="demo-step">
              <span className="demo-step-index">04</span>
              <div>
                <h3>保留语序信息</h3>
                <div className="position-row">
                  {demoResult.tokens.map((token) => (
                    <span className="position-chip" key={`position-${token.text}-${token.position}`}>
                      {language === 'en' ? `${token.text} / position ${token.position}` : `${token.text} / 位置 ${token.position}`}
                    </span>
                  ))}
                </div>
                <p>{t('就像翻译时不能丢掉语序：谁修饰谁、谁在前谁在后，都会影响理解。')}</p>
              </div>
            </article>
          ) : null}

          {canShowStep(4) ? (
            <article className="demo-step">
              <span className="demo-step-index">05</span>
              <div>
                <h3>进入注意力层：判断上下文重点</h3>
                <div className="attention-web">
                  {demoResult.tokens.map((token) => (
                    <span className="attention-node" key={`attention-${token.text}-${token.position}`}>
                      {token.text}
                    </span>
                  ))}
                </div>
                <p>{t('这里用连线感模拟注意力：每个片段都会参考上下文，像译员判断哪些词最影响当前表达。')}</p>
              </div>
            </article>
          ) : null}

          {canShowStep(5) ? (
            <article className="demo-step demo-output">
              <span className="demo-step-index">06</span>
              <div>
                <h3>模拟输出</h3>
                <p>{t('模型正在根据上下文预测下一个可能的词，就像译员根据前文选择更合适的后续表达。')}</p>
              </div>
            </article>
          ) : null}

          <div className="demo-actions">
            <PixelButton onClick={handleResetDemo}>重新演示</PixelButton>
            {!isLastStep ? <PixelButton onClick={handleNextStep}>下一步</PixelButton> : null}
          </div>

          <section className="sentence-task-lab" aria-label="自动生成的句子任务">
            <div>
              <p className="screen-label">自动任务</p>
              <h3>点一个任务，同步看讲解</h3>
            </div>
            <div className="sentence-task-grid">
              {sentenceTasks.map((task) => (
                <button
                  className={task.id === activeTask.id ? 'sentence-task-card is-active' : 'sentence-task-card'}
                  key={task.id}
                  onClick={() => handleSelectTask(task)}
                  type="button"
                >
                  <strong>{task.title}</strong>
                  <span>{task.summary}</span>
                </button>
              ))}
            </div>
            <div className="sentence-task-explanation" aria-live="polite">
              <strong>{activeTask.title}</strong>
              <p>{activeTask.explanation}</p>
              <span>
                {language === 'en'
                  ? `Synced to step ${activeTask.stepIndex + 1}: ${stepTitles[activeTask.stepIndex]}`
                  : `已同步到第 ${activeTask.stepIndex + 1} 步：${stepTitles[activeTask.stepIndex]}`}
              </span>
            </div>
          </section>
        </div>
      ) : (
        <div className="demo-empty">
          <span className="empty-grid" aria-hidden="true" />
          <p>{t('输入一句中文，这里会实时生成 Token 拆分和 5 个自动任务。')}</p>
        </div>
      )}
    </section>
  );
}
