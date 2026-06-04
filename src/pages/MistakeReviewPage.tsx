import { PixelButton } from '../components/PixelButton';
import { misconceptions } from '../data/misconceptions';
import { reverseTeachingCards } from '../data/reverseTeachingCards';
import type { PageId } from '../types/navigation';
import { readMistakeReviewRecords } from '../utils/mistakeReviewStorage';
import './mistakeReview.css';

interface MistakeReviewPageProps {
  onNavigate: (page: PageId) => void;
}

function formatLastSeen(value: string) {
  return new Date(value).toLocaleString('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function MistakeReviewPage({ onNavigate }: MistakeReviewPageProps) {
  const records = readMistakeReviewRecords()
    .slice()
    .sort((first, second) => second.count - first.count);
  const totalMistakes = records.reduce((total, record) => total + record.count, 0);
  const reviewItems = records
    .map((record) => ({
      record,
      misconception: misconceptions.find((item) => item.id === record.misconceptionId),
    }))
    .filter((item): item is { record: (typeof records)[number]; misconception: (typeof misconceptions)[number] } =>
      Boolean(item.misconception),
    );

  return (
    <main className="mistake-review-page">
      <header className="mistake-review-header">
        <div>
          <p className="screen-label">错题本 / 误区复盘</p>
          <h1>把连错变成看懂</h1>
          <p>这里负责复盘，不打断主流程。</p>
        </div>
        <div className="practice-actions">
          <PixelButton onClick={() => onNavigate('practice')}>去针对练习</PixelButton>
          <PixelButton onClick={() => onNavigate('home')}>返回主页</PixelButton>
        </div>
      </header>

      <section className="mistake-review-summary">
        <div>
          <p className="screen-label">累计复盘</p>
          <strong>{totalMistakes} 次</strong>
          <span>错过的连接，会在这里变成复盘卡。</span>
        </div>
        <div>
          <p className="screen-label">最常混淆</p>
          <strong>{reviewItems[0]?.misconception.title ?? '暂无记录'}</strong>
          <span>{reviewItems[0] ? `出现 ${reviewItems[0].record.count} 次` : '去工坊试一次，错题本会自动记录。'}</span>
        </div>
      </section>

      <section className="reverse-teaching-section" aria-label="为什么不是这样反问卡">
        <div className="reverse-teaching-heading">
          <p className="screen-label">为什么不是这样？</p>
          <h2>先问清常见困惑</h2>
          <span>这里放完整解释，主流程只保留即时提示。</span>
        </div>
        <div className="reverse-teaching-grid">
          {reverseTeachingCards.map((card) => (
            <article className="reverse-teaching-card" key={card.id}>
              <h3>{card.question}</h3>
              <strong>{card.shortAnswer}</strong>
              <p>{card.explanation}</p>
              <small>{card.analogy}</small>
            </article>
          ))}
        </div>
      </section>

      {reviewItems.length === 0 ? (
        <section className="mistake-empty">
          <h2>现在还没有错题记录</h2>
          <p>去可视化工坊试着连接模块。连错后，这里会自动生成复盘卡。</p>
          <PixelButton onClick={() => onNavigate('visualLab')}>去工坊试试看</PixelButton>
        </section>
      ) : (
        <section className="mistake-review-list" aria-label="误区复盘列表">
          {reviewItems.map(({ record, misconception }) => (
            <article className="mistake-review-card" key={record.misconceptionId}>
              <div className="mistake-review-card-top">
                <span>错过 {record.count} 次</span>
                <small>最近：{formatLastSeen(record.lastSeenAt)}</small>
              </div>
              <h2>{misconception.title}</h2>
              <div className="mistake-route">
                <span>{misconception.from}</span>
                <strong>不建议这样连</strong>
                <span>{misconception.to}</span>
              </div>
              <div className="mistake-review-grid">
                <div>
                  <strong>为什么错</strong>
                  <p>{misconception.explanation}</p>
                </div>
                <div>
                  <strong>正确思路</strong>
                  <p>{misconception.hint}</p>
                </div>
                <div>
                  <strong>一句话翻译类比</strong>
                  <p>{misconception.mtiAnalogy}</p>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
