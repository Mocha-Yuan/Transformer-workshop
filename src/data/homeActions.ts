import type { PageId } from '../types/navigation';

export interface HomeAction {
  id: PageId;
  label: string;
  description: string;
}

export const homeActions: HomeAction[] = [
  {
    id: 'onboarding',
    label: '新手引导',
    description: '先跟 TransBot 成功走一遍。',
  },
  {
    id: 'game',
    label: '开始闯关',
    description: '按关卡修复 Transformer 流程。',
  },
  {
    id: 'practice',
    label: '自由练习',
    description: '选一个模块顺序反复练。',
  },
  {
    id: 'atlas',
    label: '学习图鉴',
    description: '查看完整解释和翻译类比。',
  },
  {
    id: 'interpreter',
    label: '译员视角',
    description: '从译员动作反推模块作用。',
  },
  {
    id: 'sentenceLab',
    label: '句子实验台',
    description: '用自己的句子生成互动任务。',
  },
  {
    id: 'achievements',
    label: '我的成就',
    description: '查看已解锁的学习徽章。',
  },
  {
    id: 'mistakeReview',
    label: '错题本',
    description: '复盘常见连错原因。',
  },
  {
    id: 'finalChallenge',
    label: '最终挑战',
    description: '一次接通完整流程。',
  },
  {
    id: 'visualLab',
    label: '可视化工坊',
    description: '观察节点和信息流动。',
  },
  {
    id: 'quiz',
    label: '知识小测',
    description: '用 8 道题检查理解。',
  },
  {
    id: 'about',
    label: '关于项目',
    description: '了解这个学习工坊。',
  },
];
