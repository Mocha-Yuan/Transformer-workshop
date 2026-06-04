export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'token-role',
    question: 'Token 的作用是什么？',
    options: [
      '像译前切分，把文字分成可处理的小片段',
      '马上写出完整译文',
      '保存用户的学习进度',
      '给页面换一种颜色',
    ],
    answerIndex: 0,
    explanation: 'Token 就像译前切分出的片段。模型先处理这些小片段，再继续判断它们之间的关系。',
  },
  {
    id: 'embedding-role',
    question: 'Embedding 的作用是什么？',
    options: [
      '把 Token 变成带语义的数字表示',
      '判断答案是否正确',
      '删除句子里的标点',
      '把网页变成图片',
    ],
    answerIndex: 0,
    explanation: 'Embedding 像给翻译片段做语义卡片。模型用数字记录片段的大致含义，方便后续计算。',
  },
  {
    id: 'position-encoding',
    question: 'Position Encoding 为什么重要？',
    options: [
      '因为它像保留原文语序，告诉模型词语位置',
      '因为它负责保存图片颜色',
      '因为它让模型跳过注意力层',
      '因为它会自动翻译句子',
    ],
    answerIndex: 0,
    explanation: '语序会影响翻译理解。Position Encoding 给模型补上位置线索，避免只看到一堆打散的词。',
  },
  {
    id: 'qkv',
    question: 'Q/K/V 分别代表什么？',
    options: [
      'Query、Key、Value',
      'Question、Knowledge、Voice',
      'Quick、Kind、Vector',
      'Queue、Kernel、View',
    ],
    answerIndex: 0,
    explanation: 'Query 像译员的问题，Key 像上下文标签，Value 像真正取回的线索内容。',
  },
  {
    id: 'self-attention',
    question: 'Self-Attention 主要解决什么问题？',
    options: [
      '让每个片段判断哪些上下文最值得关注',
      '把所有词变成同一个词',
      '只保留句子的第一个字',
      '立刻把中文改写成英文',
    ],
    answerIndex: 0,
    explanation: 'Self-Attention 像译员给上下文划重点，帮助当前片段参考真正相关的信息。',
  },
  {
    id: 'multi-head',
    question: 'Multi-Head Attention 的意义是什么？',
    options: [
      '从多个角度同时理解句子关系',
      '让模型只能关注一个词',
      '把输入句子打乱顺序',
      '减少所有数字计算',
    ],
    answerIndex: 0,
    explanation: '多头注意力像翻译小组分工：同时看语法、语义、指代和语体，再合并理解。',
  },
  {
    id: 'add-norm',
    question: 'Add & Norm 的作用是什么？',
    options: [
      '保留原意，并把新理解整理得更稳定',
      '随机删除一半 Token',
      '把所有向量变成文字',
      '负责播放动画效果',
    ],
    answerIndex: 0,
    explanation: 'Add 像保留原意，Norm 像整理表达，让模型多轮加工时不容易丢失重要信息。',
  },
  {
    id: 'transformer-block',
    question: 'Transformer Block 通常由哪些部分组成？',
    options: [
      '注意力层、Add & Norm、Feed Forward 等',
      '标题、按钮、背景音乐',
      '图片压缩器和音频播放器',
      '鼠标事件和键盘事件',
    ],
    answerIndex: 0,
    explanation: 'Transformer Block 像一轮审校流程，通常包含上下文判断、保留原意与再加工等步骤。',
  },
];
