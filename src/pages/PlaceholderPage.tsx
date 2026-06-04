import { PixelButton } from '../components/PixelButton';
import { PixelPanel } from '../components/PixelPanel';
import type { PageId } from '../types/navigation';

const pageCopy: Record<'about', { title: string; body: string }> = {
  about: {
    title: '关于项目',
    body: '这是一个面向 MTI 翻译硕士的中文像素风学习应用。它不要求代码基础，而是用“切分原文、保留语序、判断上下文重点、再加工表达”等翻译学习经验，帮助你理解 Transformer 的基本思路。',
  },
};

interface PlaceholderPageProps {
  page: 'about';
  onNavigate: (page: PageId) => void;
}

export function PlaceholderPage({ page, onNavigate }: PlaceholderPageProps) {
  const copy = pageCopy[page];

  return (
    <main className="placeholder-page">
      <PixelPanel className="placeholder-panel">
        <p className="screen-label">当前页面</p>
        <h1>{copy.title}</h1>
        <p>{copy.body}</p>
        <PixelButton onClick={() => onNavigate('home')}>返回主页</PixelButton>
      </PixelPanel>
    </main>
  );
}
