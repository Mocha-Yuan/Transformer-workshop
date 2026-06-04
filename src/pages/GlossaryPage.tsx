import { useState } from 'react';
import { GlossaryCard } from '../components/GlossaryCard';
import { PixelButton } from '../components/PixelButton';
import { SentenceDemo } from '../components/SentenceDemo';
import { glossaryEntries } from '../data/glossary';
import type { PageId } from '../types/navigation';

interface GlossaryPageProps {
  onNavigate: (page: PageId) => void;
}

export function GlossaryPage({ onNavigate }: GlossaryPageProps) {
  const [openEntryId, setOpenEntryId] = useState<string>(glossaryEntries[0].id);

  function handleToggleEntry(entryId: string) {
    setOpenEntryId((currentId) => (currentId === entryId ? '' : entryId));
  }

  return (
    <main className="glossary-page">
      <header className="glossary-header">
        <div>
          <p className="screen-label">学习图鉴</p>
          <h1>Transformer 概念图鉴</h1>
          <p>这里放完整解释、类比和例子。主流程看不懂时，再回这里慢慢查。</p>
        </div>
        <div className="glossary-actions">
          <PixelButton onClick={() => onNavigate('game')}>去搭建练习</PixelButton>
          <PixelButton onClick={() => onNavigate('home')}>返回主页</PixelButton>
        </div>
      </header>

      <SentenceDemo />

      <section className="glossary-grid" aria-label="Transformer 学习图鉴条目">
        {glossaryEntries.map((entry) => (
          <GlossaryCard
            entry={entry}
            isOpen={openEntryId === entry.id}
            key={entry.id}
            onToggle={handleToggleEntry}
          />
        ))}
      </section>
    </main>
  );
}
