import type { GlossaryEntry } from '../types/glossary';
import { MiniExperiment } from './mini-experiments/MiniExperiment';

interface GlossaryCardProps {
  entry: GlossaryEntry;
  isOpen: boolean;
  onToggle: (id: string) => void;
}

export function GlossaryCard({ entry, isOpen, onToggle }: GlossaryCardProps) {
  return (
    <article className={isOpen ? 'glossary-card is-open' : 'glossary-card'}>
      <button
        aria-expanded={isOpen}
        className="glossary-card-button"
        onClick={() => onToggle(entry.id)}
        type="button"
      >
        <span className="glossary-pixel-icon" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </span>
        <span className="glossary-title">
          <strong>{entry.nameZh}</strong>
          <small>{entry.nameEn}</small>
        </span>
        <span className="glossary-summary">{entry.shortDescription}</span>
        <span className="glossary-toggle" aria-hidden="true">
          {isOpen ? '收起' : '展开'}
        </span>
      </button>

      {isOpen ? (
        <div className="glossary-detail">
          <div>
            <strong>类比解释</strong>
            <p>{entry.analogy}</p>
          </div>
          <div>
            <strong>简单例子</strong>
            <p>{entry.example}</p>
          </div>
          <div>
            <strong>在 Transformer 中的作用</strong>
            <p>{entry.role}</p>
          </div>
          <MiniExperiment moduleId={entry.id} />
        </div>
      ) : null}
    </article>
  );
}
