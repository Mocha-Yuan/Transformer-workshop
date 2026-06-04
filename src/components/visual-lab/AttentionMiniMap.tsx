import { useState } from 'react';

const tokens = ['我', '喜欢', '学习', '翻译'];
const attentionWeights = [
  [0.9, 0.2, 0.1, 0.1],
  [0.3, 0.8, 0.4, 0.2],
  [0.1, 0.4, 0.9, 0.7],
  [0.1, 0.2, 0.8, 0.9],
];

function getCellStyle(weight: number) {
  return {
    opacity: 0.35 + weight * 0.65,
  };
}

export function AttentionMiniMap() {
  const [hoverText, setHoverText] = useState('把鼠标移到方格上，看看一个词正在关注谁。');

  return (
    <section className="attention-mini-map" aria-label="模拟注意力矩阵">
      <div>
        <p className="screen-label">模拟注意力矩阵</p>
        <p>注意力矩阵用来表示一个词会多大程度关注句子中的其他词。</p>
      </div>
      <div className="attention-matrix" role="grid" aria-label="我 喜欢 学习 翻译 的注意力权重">
        <span className="attention-corner" />
        {tokens.map((token) => (
          <span className="attention-axis" key={`col-${token}`}>
            {token}
          </span>
        ))}
        {attentionWeights.map((row, rowIndex) => (
          <div className="attention-row" key={tokens[rowIndex]} role="row">
            <span className="attention-axis">{tokens[rowIndex]}</span>
            {row.map((weight, colIndex) => (
              <button
                aria-label={`${tokens[rowIndex]} 正在关注 ${tokens[colIndex]}，权重 ${weight}`}
                className="attention-cell"
                key={`${tokens[rowIndex]}-${tokens[colIndex]}`}
                onBlur={() => setHoverText('把鼠标移到方格上，看看一个词正在关注谁。')}
                onFocus={() => setHoverText(`“${tokens[rowIndex]}” 正在关注 “${tokens[colIndex]}”`)}
                onMouseEnter={() => setHoverText(`“${tokens[rowIndex]}” 正在关注 “${tokens[colIndex]}”`)}
                onMouseLeave={() => setHoverText('把鼠标移到方格上，看看一个词正在关注谁。')}
                style={getCellStyle(weight)}
                type="button"
              >
                {weight.toFixed(1)}
              </button>
            ))}
          </div>
        ))}
      </div>
      <p className="attention-hover-text">{hoverText}</p>
    </section>
  );
}
