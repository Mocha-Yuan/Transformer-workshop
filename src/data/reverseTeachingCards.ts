export interface ReverseTeachingCard {
  id: string;
  question: string;
  shortAnswer: string;
  explanation: string;
  analogy: string;
}

export const reverseTeachingCards: ReverseTeachingCard[] = [
  {
    id: 'output-before-understanding',
    question: '为什么不能先输出再理解？',
    shortAnswer: '输出是理解加工后的结果，不是第一步。',
    explanation: '模型要先把文本切片、表示、加入位置，再通过注意力和加工层整理信息，最后才有足够依据输出。',
    analogy: '像译员不能没读原文就直接写译文，否则写得再顺也可能完全跑题。',
  },
  {
    id: 'embedding-replace-token',
    question: '为什么 Embedding 不能代替 Token？',
    shortAnswer: 'Embedding 要服务于具体词块，前提是先知道词块有哪些。',
    explanation: 'Token 负责把文字切成可处理单位；Embedding 负责给这些单位建立语义表示。两者解决的问题不同。',
    analogy: '像先把句子拆成意群，再给每个意群写解释；不能还没拆句就直接做解释卡。',
  },
  {
    id: 'multi-head-repeat',
    question: '为什么 Multi-Head 不是重复做很多遍？',
    shortAnswer: '多头是多角度同时观察，不是机械重复。',
    explanation: '不同注意力头可以关注不同关系，比如指代、修饰、语气、逻辑连接，合起来形成更完整的理解。',
    analogy: '像翻译小组分工审句：有人看术语，有人看语法，有人看上下文衔接。',
  },
  {
    id: 'position-after-output',
    question: '为什么位置编码不能放到最后？',
    shortAnswer: '语序线索要在理解早期加入。',
    explanation: '如果模型在注意力和加工之前不知道位置，后面的关系判断就可能建立在错误语序上。',
    analogy: '像译员写完译文后才发现主谓宾顺序看反了，前面的判断已经错位。',
  },
];
