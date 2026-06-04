import type { ModuleId } from '../types/game';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlockHint: string;
  moduleId?: ModuleId;
}

export const achievements: Achievement[] = [
  {
    id: 'token-slicer',
    title: '原文切片师',
    description: '第一次完成 Token 相关流程。',
    unlockHint: '你已经知道原文要先被切成模型能处理的小单位。',
    moduleId: 'token',
  },
  {
    id: 'order-keeper',
    title: '语序守护者',
    description: '完成 Position Encoding 相关关卡。',
    unlockHint: '你已经理解：同样的词，顺序不同，意思也会变。',
    moduleId: 'position-encoding',
  },
  {
    id: 'context-scout',
    title: '上下文侦察员',
    description: '完成注意力相关关卡。',
    unlockHint: '你已经理解了注意力机制如何帮助模型回看上下文。',
    moduleId: 'self-attention',
  },
  {
    id: 'multi-view-reader',
    title: '多视角审句员',
    description: '完成 Multi-Head Attention 相关关卡。',
    unlockHint: '你已经会从多个角度观察一句话里的关系。',
    moduleId: 'multi-head-attention',
  },
  {
    id: 'transbot-repairer',
    title: 'TransBot 修复员',
    description: '完成完整 Transformer 流程。',
    unlockHint: '你已经接通了从原文入口到输出预测的完整理解线路。',
    moduleId: 'output',
  },
  {
    id: 'review-master',
    title: '复盘达人',
    description: '查看或触发 3 次错误复盘。',
    unlockHint: '你开始能把“连错了”变成“我知道为什么错”。',
  },
  {
    id: 'practice-regular',
    title: '练习常客',
    description: '累计完成 5 次自由练习。',
    unlockHint: '反复练习正在把 Transformer 流程变成你的熟悉动作。',
  },
  {
    id: 'final-challenger',
    title: '终局接线员',
    description: '完成最终综合挑战。',
    unlockHint: '你已经独立修复了 TransBot 的完整翻译理解线路。',
  },
];
