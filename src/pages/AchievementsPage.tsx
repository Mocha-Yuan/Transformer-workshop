import { AchievementPanel } from '../components/achievements/AchievementPanel';
import { PixelButton } from '../components/PixelButton';
import type { PageId } from '../types/navigation';

interface AchievementsPageProps {
  onNavigate: (page: PageId) => void;
}

export function AchievementsPage({ onNavigate }: AchievementsPageProps) {
  return (
    <main className="practice-page">
      <header className="practice-header">
        <div>
          <p className="screen-label">成就系统</p>
          <h1>我的 TransBot 徽章墙</h1>
          <p>这里记录你已经完成的学习动作。</p>
        </div>
        <div className="practice-actions">
          <PixelButton onClick={() => onNavigate('game')}>继续闯关</PixelButton>
          <PixelButton onClick={() => onNavigate('home')}>返回主页</PixelButton>
        </div>
      </header>

      <AchievementPanel />
    </main>
  );
}
