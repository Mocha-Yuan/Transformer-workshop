import { useState } from 'react';
import '../achievements/achievements.css';
import './miniExperiment.css';

interface MiniExperimentProps {
  moduleId: string;
}

export function MiniExperiment({ moduleId }: MiniExperimentProps) {
  const [tokenStep, setTokenStep] = useState(0);
  const [hasCompared, setHasCompared] = useState(false);
  const [attentionChoice, setAttentionChoice] = useState('');

  if (moduleId === 'token') {
    const tokenPieces = ['我', '喜欢', '机器翻译'];

    return (
      <section className="mini-experiment" aria-label="Token 小实验">
        <strong>30 秒小实验：原文切片</strong>
        <p className="mini-source-sentence">我喜欢机器翻译。</p>
        <div className="mini-token-row">
          {tokenStep === 0 ? <span>完整句子</span> : tokenPieces.map((piece) => <button key={piece} type="button">{piece}</button>)}
        </div>
        <button className="mini-panel-button" onClick={() => setTokenStep((step) => (step === 0 ? 1 : 0))} type="button">
          {tokenStep === 0 ? '点击切成词块' : '重新合并'}
        </button>
        {tokenStep > 0 ? <p>Token 化就是把连续文本切成模型可以处理的小单位。</p> : null}
      </section>
    );
  }

  if (moduleId === 'position-encoding') {
    return (
      <section className="mini-experiment" aria-label="Position Encoding 小实验">
        <strong>30 秒小实验：比较语序</strong>
        <div className="mini-position-pair">
          <button onClick={() => setHasCompared(true)} type="button">我喜欢翻译。</button>
          <button onClick={() => setHasCompared(true)} type="button">翻译喜欢我。</button>
        </div>
        {hasCompared ? (
          <p>词一样，但顺序不同，意义完全不同。这就是为什么模型需要位置信息。</p>
        ) : (
          <p>点击任意一句，观察同样词语换位置后的变化。</p>
        )}
      </section>
    );
  }

  if (moduleId === 'self-attention') {
    return (
      <section className="mini-experiment" aria-label="Self-Attention 小实验">
        <strong>30 秒小实验：给“它”分配关注对象</strong>
        <p className="mini-source-sentence">这本书很难，但它很有价值。</p>
        <div className="mini-attention-choice">
          <button
            className={attentionChoice === 'book' ? 'is-selected' : undefined}
            onClick={() => setAttentionChoice('book')}
            type="button"
          >
            这本书
          </button>
          <button
            className={attentionChoice === 'hard' ? 'is-selected' : undefined}
            onClick={() => setAttentionChoice('hard')}
            type="button"
          >
            很难
          </button>
        </div>
        {attentionChoice ? (
          <p>
            {attentionChoice === 'book'
              ? '很好，“它”更可能回指“这本书”。Attention 会帮助模型判断一个词应该重点参考哪些上下文。'
              : '这里容易误会。“很难”描述状态，但“它”更可能指向“这本书”。'}
          </p>
        ) : (
          <p>选择你认为“它”最应该关注的对象。</p>
        )}
      </section>
    );
  }

  return (
    <section className="mini-experiment" aria-label="模块小实验开发中">
      <strong>小实验开发中</strong>
      <p>这个模块的互动实验稍后开放。你可以先阅读上面的翻译类比，再回到工坊练一遍。</p>
    </section>
  );
}
