import { PixelButton } from '../components/PixelButton';
import { SentenceDemo } from '../components/SentenceDemo';
import type { PageId } from '../types/navigation';

interface SentenceLabPageProps {
  onNavigate: (page: PageId) => void;
}

export function SentenceLabPage({ onNavigate }: SentenceLabPageProps) {
  return (
    <main className="glossary-page">
      <header className="glossary-header">
        <div>
          <p className="screen-label">句子实验台</p>
          <h1>拿一句话试 Transformer</h1>
          <p>输入自己的句子，生成 Token、语序、指代、连接词和重点词任务。</p>
        </div>
        <div className="glossary-actions">
          <PixelButton onClick={() => onNavigate('game')}>去闯关</PixelButton>
          <PixelButton onClick={() => onNavigate('home')}>返回主页</PixelButton>
        </div>
      </header>

      <SentenceDemo />
    </main>
  );
}
