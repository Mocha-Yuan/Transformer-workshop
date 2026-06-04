import { useState } from 'react';
import { LearningPathMap } from '../components/learning-path/LearningPathMap';
import { PixelButton } from '../components/PixelButton';
import type { PageId } from '../types/navigation';
import './onboarding.css';

interface OnboardingPageProps {
  onNavigate: (page: PageId) => void;
}

const tutorialSteps = [
  {
    title: '第一步：什么是 Token？',
    subtitle: '模型先读小片段。',
    body: '先把“我喜欢机器翻译”切成“我 / 喜欢 / 机器翻译”。',
    action: '切成小块',
  },
  {
    title: '第二步：为什么要语序？',
    subtitle: '顺序变了，关系也会变。',
    body: '同样的词换个位置，谁做什么就可能不一样。',
    action: '看看顺序',
  },
  {
    title: '第三步：为什么要注意力？',
    subtitle: '理解一个词，要回看上下文。',
    body: '读到“它”时，需要回头找它可能指向谁。',
    action: '点亮线索',
  },
  {
    title: '第四步：亲手连一次',
    subtitle: '先成功一次就够了。',
    body: '第一关只需要记住：Token → Embedding → Position Encoding。',
    action: '进入第一关',
  },
];

export function OnboardingPage({ onNavigate }: OnboardingPageProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const step = tutorialSteps[stepIndex];
  const isLastStep = stepIndex === tutorialSteps.length - 1;

  return (
    <main className="onboarding-page">
      <header className="onboarding-header">
        <div>
          <p className="screen-label">3 分钟新手教程</p>
          <h1>先陪 TransBot 成功一次</h1>
          <p>四个小动作，带你进入第一关。</p>
        </div>
        <div className="practice-actions">
          <PixelButton onClick={() => onNavigate('game')}>跳到闯关</PixelButton>
          <PixelButton onClick={() => onNavigate('home')}>返回主页</PixelButton>
        </div>
      </header>

      <LearningPathMap />

      <section className="onboarding-stage" aria-label="新手引导剧情线">
        <div className="onboarding-dialog">
          <span className="transbot-avatar" aria-hidden="true">
            T
          </span>
          <div>
            <p className="screen-label">TransBot 新手频道</p>
            <h2>{step.title}</h2>
            <strong>{step.subtitle}</strong>
            <p>{step.body}</p>
          </div>
        </div>

        <div className={`onboarding-demo onboarding-demo-${stepIndex}`}>
          {stepIndex === 0 ? (
            <>
              <span className="demo-sentence">我喜欢机器翻译</span>
              <div className="onboarding-token-row">
                <span>我</span>
                <span>喜欢</span>
                <span>机器翻译</span>
              </div>
            </>
          ) : null}

          {stepIndex === 1 ? (
            <div className="onboarding-compare">
              <span>我 / 喜欢 / 翻译</span>
              <span>翻译 / 喜欢 / 我</span>
              <strong>词块相近，顺序改变，关系就改变。</strong>
            </div>
          ) : null}

          {stepIndex === 2 ? (
            <div className="onboarding-attention">
              <span>小猫</span>
              <span>看见</span>
              <span>小狗</span>
              <span className="is-focus">它</span>
              <i aria-hidden="true" />
              <strong>“它”会回看上下文找线索。</strong>
            </div>
          ) : null}

          {stepIndex === 3 ? (
            <div className="onboarding-mini-flow">
              <span>Token</span>
              <span>Embedding</span>
              <span>Position Encoding</span>
              <strong>这就是第一关的最短成功路线。</strong>
            </div>
          ) : null}
        </div>

        <div className="onboarding-actions">
          <PixelButton disabled={stepIndex === 0} onClick={() => setStepIndex((index) => Math.max(index - 1, 0))}>
            上一步
          </PixelButton>
          {isLastStep ? (
            <PixelButton onClick={() => onNavigate('game')}>{step.action}</PixelButton>
          ) : (
            <PixelButton onClick={() => setStepIndex((index) => Math.min(index + 1, tutorialSteps.length - 1))}>
              {step.action}
            </PixelButton>
          )}
        </div>

        <div className="onboarding-progress" aria-label={`教程进度 ${stepIndex + 1} / ${tutorialSteps.length}`}>
          {tutorialSteps.map((item, index) => (
            <span className={index <= stepIndex ? 'is-active' : undefined} key={item.title}>
              {index + 1}
            </span>
          ))}
        </div>
      </section>
    </main>
  );
}
