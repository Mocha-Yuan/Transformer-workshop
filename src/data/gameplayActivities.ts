export interface AttentionRiddle {
  id: string;
  sentence: string;
  pronoun: string;
  question: string;
  options: string[];
  answer: string;
  clue: string;
  explanation: string;
}

export interface GameplayActivity {
  id: string;
  title: string;
  goal: string;
  kind: 'token' | 'position' | 'qkv' | 'attention' | 'multi-head' | 'output';
}

export interface QuestChapter {
  levelId: string;
  chapter: string;
  brief: string;
  reward: string;
}

export const attentionRiddles: AttentionRiddle[] = [
  {
    id: 'cake-fridge',
    sentence: '妈妈把蛋糕放进冰箱，因为它会融化。',
    pronoun: '它',
    question: '“它”指谁？',
    options: ['蛋糕', '冰箱', '妈妈'],
    answer: '蛋糕',
    clue: '会融化的是食物，不是冰箱。',
    explanation: 'Attention 会让“它”回看前面的候选词，再把“蛋糕”这条线索权重调高。',
  },
  {
    id: 'cat-dog',
    sentence: '小猫看见小狗，因为它很害怕。',
    pronoun: '它',
    question: '“它”更可能指谁？',
    options: ['小猫', '小狗', '看见'],
    answer: '小猫',
    clue: '这句话里“害怕”的主体更像看到对方的小猫。',
    explanation: 'Attention 不是只看最近的词，而是比较上下文里哪条线索最能解释当前词。',
  },
  {
    id: 'glossary',
    sentence: '译员查了术语表，因为它能解释专业词。',
    pronoun: '它',
    question: '“它”指谁？',
    options: ['译员', '术语表', '专业词'],
    answer: '术语表',
    clue: '能解释专业词的是工具，而不是查工具的人。',
    explanation: 'Attention 会把“解释专业词”和“术语表”连得更强。',
  },
];

export const gameplayActivities: Record<string, GameplayActivity> = {
  'text-enters-model': {
    id: 'token-split',
    title: '切句子挑战',
    goal: '先把原文拆成几个能继续处理的小片段。',
    kind: 'token',
  },
  'attention-trio': {
    id: 'qkv-match',
    title: 'Q/K/V 配对',
    goal: '把“问题、标签、内容”分清楚。',
    kind: 'qkv',
  },
  'self-attention': {
    id: 'attention-riddle',
    title: 'Attention 指代谜题',
    goal: '先猜代词指向，再看回看过程。',
    kind: 'attention',
  },
  'transformer-core': {
    id: 'multi-head-tags',
    title: '多视角审句',
    goal: '从语法、指代、语气和逻辑四个角度给句子贴标签。',
    kind: 'multi-head',
  },
  'full-transformer-flow': {
    id: 'output-choice',
    title: '输出选择题',
    goal: '在几种输出里选最符合上下文的一句。',
    kind: 'output',
  },
};

export const positionActivity: GameplayActivity = {
  id: 'position-order',
  title: '语序翻转实验',
  goal: '比较词一样但顺序不同的时候，意思怎么变。',
  kind: 'position',
};

export const questChapters: QuestChapter[] = [
  {
    levelId: 'text-enters-model',
    chapter: '委托 01：抢救原文入口',
    brief: 'TransBot 收到一封急件，但它还不会把句子拆开读。',
    reward: '解锁“原文入口”线路。',
  },
  {
    levelId: 'attention-trio',
    chapter: '委托 02：找回上下文检索器',
    brief: '它开始读句子了，但还不知道该问什么、去哪找线索。',
    reward: '解锁 Q/K/V 检索工具。',
  },
  {
    levelId: 'self-attention',
    chapter: '委托 03：破解指代谜题',
    brief: '它总把“它、他、这”看成孤立词，需要学会回看上下文。',
    reward: '解锁上下文聚光灯。',
  },
  {
    levelId: 'transformer-core',
    chapter: '委托 04：多人审句会议',
    brief: '单一角度不够了，TransBot 需要同时检查语法、指代、语气和逻辑。',
    reward: '解锁多头审句团。',
  },
  {
    levelId: 'full-transformer-flow',
    chapter: '委托 05：交付译文草案',
    brief: '最后把输入、上下文、加工和输出接成一条完整任务线。',
    reward: '完成 TransBot 的翻译任务报告。',
  },
];
