import { useState } from 'react';
import { PixelButton } from '../components/PixelButton';
import { quizQuestions } from '../data/quiz';
import { markLevelCompleted } from '../services/progressService';
import type { PageId } from '../types/navigation';

const HIGH_SCORE_KEY = 'transformer-workshop-quiz-high-score';
const LAST_SCORE_KEY = 'transformer-workshop-quiz-last-score';

interface QuizPageProps {
  onNavigate: (page: PageId) => void;
}

function saveQuizScore(score: number) {
  if (typeof window === 'undefined') {
    return;
  }

  const savedHighScore = Number(window.localStorage.getItem(HIGH_SCORE_KEY) ?? '0');
  const nextHighScore = Math.max(savedHighScore, score);

  window.localStorage.setItem(LAST_SCORE_KEY, String(score));
  window.localStorage.setItem(HIGH_SCORE_KEY, String(nextHighScore));
}

export function QuizPage({ onNavigate }: QuizPageProps) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const answeredCount = Object.keys(answers).length;
  const score = quizQuestions.reduce((total, question) => {
    return answers[question.id] === question.answerIndex ? total + 1 : total;
  }, 0);
  const isFinished = answeredCount === quizQuestions.length;

  function handleChoose(questionId: string, optionIndex: number) {
    if (answers[questionId] !== undefined) {
      return;
    }

    const nextAnswers = { ...answers, [questionId]: optionIndex };
    setAnswers(nextAnswers);

    if (Object.keys(nextAnswers).length === quizQuestions.length) {
      const nextScore = quizQuestions.reduce((total, question) => {
        return nextAnswers[question.id] === question.answerIndex ? total + 1 : total;
      }, 0);
      saveQuizScore(nextScore);
      void markLevelCompleted(
        'quiz:transformer-understanding',
        nextScore,
        quizQuestions
          .filter((question) => nextAnswers[question.id] !== question.answerIndex)
          .map((question) => ({
            questionId: question.id,
            selectedIndex: nextAnswers[question.id],
            answerIndex: question.answerIndex,
          })),
        'Transformer 理解测验',
      ).catch((error) => {
        console.warn('Supabase quiz score save failed.', error);
      });
    }
  }

  function handleRestart() {
    setAnswers({});
  }

  return (
    <main className="quiz-page">
      <header className="quiz-header">
        <div>
          <p className="screen-label">知识小测</p>
          <h1>Transformer 理解检测</h1>
          <p>选完立即看原因。完整解释可以回图鉴复习。</p>
        </div>
        <div className="quiz-actions">
          <PixelButton onClick={() => onNavigate('atlas')}>学习图鉴</PixelButton>
          <PixelButton onClick={() => onNavigate('home')}>返回主页</PixelButton>
        </div>
      </header>

      <section className="quiz-score-panel" aria-label="测验进度">
        <span>已答 {answeredCount} / {quizQuestions.length}</span>
        <strong>当前得分 {score}</strong>
        <div className="hud-progress" aria-label={`答题进度 ${answeredCount} / ${quizQuestions.length}`}>
          <span style={{ width: `${(answeredCount / quizQuestions.length) * 100}%` }} />
        </div>
      </section>

      <section className="quiz-list" aria-label="Transformer 中文测验题目">
        {quizQuestions.map((question, questionIndex) => {
          const selectedAnswer = answers[question.id];
          const hasAnswered = selectedAnswer !== undefined;
          const isCorrect = selectedAnswer === question.answerIndex;

          return (
            <article className="quiz-card" key={question.id}>
              <div className="quiz-question-title">
                <span>{String(questionIndex + 1).padStart(2, '0')}</span>
                <h2>{question.question}</h2>
              </div>

              <div className="quiz-options">
                {question.options.map((option, optionIndex) => {
                  const isSelected = selectedAnswer === optionIndex;
                  const isRightAnswer = question.answerIndex === optionIndex;
                  const optionClassName = [
                    'quiz-option',
                    isSelected ? 'is-selected' : '',
                    hasAnswered && isRightAnswer ? 'is-correct' : '',
                    hasAnswered && isSelected && !isRightAnswer ? 'is-wrong' : '',
                  ]
                    .filter(Boolean)
                    .join(' ');

                  return (
                    <button
                      className={optionClassName}
                      disabled={hasAnswered}
                      key={option}
                      onClick={() => handleChoose(question.id, optionIndex)}
                      type="button"
                    >
                      <span>{String.fromCharCode(65 + optionIndex)}</span>
                      {option}
                    </button>
                  );
                })}
              </div>

              {hasAnswered ? (
                <div className={isCorrect ? 'quiz-feedback is-correct' : 'quiz-feedback is-wrong'} role="status">
                  <strong>{isCorrect ? '回答正确' : '再想一想'}</strong>
                  <p>{question.explanation}</p>
                </div>
              ) : null}
            </article>
          );
        })}
      </section>

      {isFinished ? (
        <section className="quiz-result" aria-label="测验结果">
          <p className="screen-label">测验完成</p>
          <h2>
            总分：{score} / {quizQuestions.length}
          </h2>
          <p>{score >= 6 ? '不错，你已经抓住主流程了。' : '没关系，先回图鉴补一遍关键概念。'}</p>
          <div className="quiz-actions">
            <PixelButton onClick={handleRestart}>重新答题</PixelButton>
            <PixelButton onClick={() => onNavigate('atlas')}>复习图鉴</PixelButton>
          </div>
        </section>
      ) : null}
    </main>
  );
}
