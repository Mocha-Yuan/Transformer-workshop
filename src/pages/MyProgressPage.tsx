import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PixelButton } from '../components/PixelButton';
import { PixelPanel } from '../components/PixelPanel';
import { levels } from '../data/levels';
import { practiceLevels } from '../data/practiceLevels';
import { getMyProgress, resetMyProgress, type GameProgressRow } from '../services/progressService';
import { authErrorToChinese } from '../utils/authErrorMessages';

const knowledgePoints = [
  ...levels.map((level) => ({
    id: `campaign:${level.id}`,
    title: level.title,
    group: '主线关卡',
  })),
  ...practiceLevels.map((level) => ({
    id: `practice:${level.id}`,
    title: level.title,
    group: '自由练习',
  })),
  {
    id: 'quiz:transformer-understanding',
    title: 'Transformer 理解测验',
    group: '知识小测',
  },
  {
    id: 'challenge:final-transformer-flow',
    title: '最终综合挑战',
    group: '最终挑战',
  },
];

function formatTime(value: string | null | undefined) {
  if (!value) {
    return '还没有记录';
  }

  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

export function MyProgressPage() {
  const navigate = useNavigate();
  const [progressRows, setProgressRows] = useState<GameProgressRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isResetting, setIsResetting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    getMyProgress()
      .then((rows) => {
        if (isMounted) {
          setProgressRows(rows);
        }
      })
      .catch((error) => {
        if (isMounted) {
          setErrorMessage(authErrorToChinese(error instanceof Error ? error.message : '读取进度失败'));
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const progressByLevelId = useMemo(
    () => new Map(progressRows.map((row) => [row.level_id, row])),
    [progressRows],
  );
  const completedRows = progressRows.filter((row) => row.status === 'completed');
  const rowsWithScore = completedRows.filter((row) => typeof row.score === 'number');
  const averageScore =
    rowsWithScore.length > 0
      ? Math.round(rowsWithScore.reduce((total, row) => total + (row.score ?? 0), 0) / rowsWithScore.length)
      : 0;
  const latestUpdatedAt = progressRows[0]?.updated_at;

  async function handleReset() {
    const confirmed = window.confirm('确定要清空当前账号的所有后端学习进度吗？本地浏览器记录不会被删除。');

    if (!confirmed) {
      return;
    }

    setIsResetting(true);
    setErrorMessage('');

    try {
      await resetMyProgress();
      setProgressRows([]);
    } catch (error) {
      setErrorMessage(authErrorToChinese(error instanceof Error ? error.message : '清空进度失败'));
    } finally {
      setIsResetting(false);
    }
  }

  return (
    <main className="progress-page">
      <PixelPanel className="progress-panel">
        <p className="screen-label">我的进度</p>
        <h1>Transformer 学习路线图</h1>
        <p className="intro-text">这些记录来自 Supabase，每个登录用户只能看到自己的数据。</p>

        {isLoading ? <p className="form-message">正在同步进度...</p> : null}
        {errorMessage ? <p className="form-message is-error">{errorMessage}</p> : null}

        <section className="progress-stats" aria-label="学习进度统计">
          <div>
            <span>总关卡数</span>
            <strong>{knowledgePoints.length}</strong>
          </div>
          <div>
            <span>已完成</span>
            <strong>{knowledgePoints.filter((point) => progressByLevelId.get(point.id)?.status === 'completed').length}</strong>
          </div>
          <div>
            <span>平均分</span>
            <strong>{averageScore || '--'}</strong>
          </div>
          <div>
            <span>最近学习</span>
            <strong>{formatTime(latestUpdatedAt)}</strong>
          </div>
        </section>

        <section className="progress-list" aria-label="Transformer 知识点完成状态">
          {knowledgePoints.map((point) => {
            const row = progressByLevelId.get(point.id);
            const status = row?.status ?? 'not_started';

            return (
              <article className={`progress-item is-${status}`} key={point.id}>
                <div>
                  <span>{point.group}</span>
                  <h2>{row?.level_title || point.title}</h2>
                  <p>最近更新：{formatTime(row?.updated_at)}</p>
                </div>
                <strong>
                  {status === 'completed' ? '已完成' : status === 'in_progress' ? '进行中' : '未开始'}
                  {typeof row?.score === 'number' ? ` · ${row.score} 分` : ''}
                </strong>
              </article>
            );
          })}
        </section>

        <div className="profile-actions">
          <PixelButton onClick={() => navigate('/')}>返回首页</PixelButton>
          <PixelButton disabled={isResetting} onClick={handleReset}>
            {isResetting ? '正在清空...' : '清空后端进度'}
          </PixelButton>
        </div>
      </PixelPanel>
    </main>
  );
}
