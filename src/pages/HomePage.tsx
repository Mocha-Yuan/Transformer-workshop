import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../auth/useAuth';
import { PixelButton } from '../components/PixelButton';
import { PixelPanel } from '../components/PixelPanel';
import { LearningPathMap } from '../components/learning-path/LearningPathMap';
import { homeActions } from '../data/homeActions';
import { practiceLevels } from '../data/practiceLevels';
import { getMyProgress, type GameProgressRow } from '../services/progressService';
import type { PageId } from '../types/navigation';

const QUIZ_HIGH_SCORE_KEY = 'transformer-workshop-quiz-high-score';
const PRACTICE_COMPLETED_KEY = 'practice_completed_levels';

interface HomePageProps {
  onNavigate: (page: PageId) => void;
}

function loadQuizHighScore() {
  if (typeof window === 'undefined') {
    return 0;
  }

  return Number(window.localStorage.getItem(QUIZ_HIGH_SCORE_KEY) ?? '0');
}

function loadCompletedPracticeCount() {
  if (typeof window === 'undefined') {
    return 0;
  }

  try {
    const completedLevelIds = JSON.parse(window.localStorage.getItem(PRACTICE_COMPLETED_KEY) ?? '[]');

    if (!Array.isArray(completedLevelIds)) {
      return 0;
    }

    const validPracticeIds = new Set(practiceLevels.map((level) => level.id));
    const completedValidIds = new Set(
      completedLevelIds.filter((levelId): levelId is string => typeof levelId === 'string' && validPracticeIds.has(levelId)),
    );

    return completedValidIds.size;
  } catch {
    return 0;
  }
}

export function HomePage({ onNavigate }: HomePageProps) {
  const { user } = useAuth();
  const [remoteProgress, setRemoteProgress] = useState<GameProgressRow[]>([]);
  const localQuizHighScore = loadQuizHighScore();
  const localCompletedPracticeCount = loadCompletedPracticeCount();
  const quizHighScore = useMemo(() => {
    const remoteQuizScore = remoteProgress.find((row) => row.level_id === 'quiz:transformer-understanding')?.score;

    return Math.max(localQuizHighScore, remoteQuizScore ?? 0);
  }, [localQuizHighScore, remoteProgress]);
  const completedPracticeCount = useMemo(() => {
    const remoteCompletedPracticeIds = new Set(
      remoteProgress
        .filter((row) => row.status === 'completed' && row.level_id.startsWith('practice:'))
        .map((row) => row.level_id.replace('practice:', '')),
    );

    return Math.max(localCompletedPracticeCount, remoteCompletedPracticeIds.size);
  }, [localCompletedPracticeCount, remoteProgress]);

  useEffect(() => {
    if (!user) {
      return;
    }

    let isMounted = true;

    getMyProgress()
      .then((rows) => {
        if (isMounted) {
          setRemoteProgress(rows);
        }
      })
      .catch((error) => {
        console.warn('Supabase home progress load failed.', error);
      });

    return () => {
      isMounted = false;
    };
  }, [user]);

  return (
    <main className="home-page">
      <div className="pixel-stars" aria-hidden="true" />
      <PixelPanel className="hero-panel">
        <div className="workbench-mark" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>

        <h1>Transformer 工坊：手搓大模型</h1>
        <p className="intro-text">用拖拽和连线，亲手走完 Transformer 的核心流程。</p>

        <div className="story-panel" aria-label="剧情任务">
          <span>翻译任务</span>
          <p>TransBot 收到一批机器翻译急件，但语言理解线路乱了。你要边解谜边修复模块，最后交付一份译文草案。</p>
        </div>

        <div className="home-score-board" aria-label="学习记录">
          <span>知识小测最高分</span>
          <strong>{quizHighScore} / 8</strong>
          <span>已完成自由练习</span>
          <strong>{completedPracticeCount} / {practiceLevels.length}</strong>
        </div>

        <LearningPathMap compact />

        <div className="action-grid" aria-label="主页导航">
          {homeActions.map((action) => (
            <PixelButton key={action.id} onClick={() => onNavigate(action.id)}>
              <span className="button-label">{action.label}</span>
              <span className="button-description">{action.description}</span>
            </PixelButton>
          ))}
        </div>
      </PixelPanel>
    </main>
  );
}
