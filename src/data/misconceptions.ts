export interface Misconception {
  id: string;
  from: string;
  to: string;
  title: string;
  explanation: string;
  mtiAnalogy: string;
  hint: string;
}

export const misconceptions: Misconception[] = [
  {
    id: 'embedding-before-token',
    from: 'embedding',
    to: 'token',
    title: '为什么不能先 Embedding 再 Token？',
    explanation: 'Embedding 需要先知道要表示哪些词块，因此必须先完成 Token 化。',
    mtiAnalogy: '就像译员必须先把原句切成可理解的词块，才能为每个词块建立语义印象。',
    hint: '先让文本变成 Token，再让 Token 变成语义向量。',
  },
  {
    id: 'position-before-embedding',
    from: 'position-encoding',
    to: 'embedding',
    title: '为什么不能先标位置再建立语义？',
    explanation: 'Position Encoding 是给已经形成的词块表示补上位置信息，不能替代语义表示。',
    mtiAnalogy: '像译员先要知道每个词块是什么意思，再判断它在句子里的位置作用。',
    hint: '先完成 Embedding，再把位置提示叠加进去。',
  },
  {
    id: 'skip-embedding',
    from: 'token',
    to: 'position-encoding',
    title: '为什么 Token 不能直接跳到位置标记？',
    explanation: '模型不仅要知道词块在哪里，还要先把词块变成可计算的语义表示。',
    mtiAnalogy: '只给词块编号还不够，译员也需要知道每个词块表达了什么。',
    hint: 'Token 后面先接 Embedding，再接 Position Encoding。',
  },
  {
    id: 'self-attention-before-qkv',
    from: 'query',
    to: 'self-attention',
    title: '为什么不能只带 Query 进入 Self-Attention？',
    explanation: 'Self-Attention 需要 Query、Key、Value 配合：有问题、线索和内容，才能判断关注重点。',
    mtiAnalogy: '像译员只有问题还不够，还要有原文线索和可参考内容。',
    hint: '先把 Query、Key、Value 三件套接齐，再进入 Self-Attention。',
  },
  {
    id: 'key-to-self-attention-too-early',
    from: 'key',
    to: 'self-attention',
    title: '为什么 Key 不能单独进入 Self-Attention？',
    explanation: 'Key 只是线索标签，需要和 Query 匹配，并由 Value 提供真正被取回的信息。',
    mtiAnalogy: '像原文里只有标签没有问题和解释，译员仍然无法完成判断。',
    hint: '按 Query → Key → Value 的顺序准备注意力材料。',
  },
  {
    id: 'value-before-key',
    from: 'value',
    to: 'key',
    title: '为什么不能先拿内容再找线索？',
    explanation: 'Value 是被注意力权重取回的内容，通常要先有 Query 与 Key 的匹配关系。',
    mtiAnalogy: '像译员不能还没定位线索就直接引用解释，否则容易拿错上下文。',
    hint: '先用 Query 对上 Key，再让 Value 提供内容。',
  },
  {
    id: 'output-before-position',
    from: 'output',
    to: 'position-encoding',
    title: '为什么 Position Encoding 不能放在 Output 后面？',
    explanation: '位置信息要在模型理解句子早期加入，否则后面的注意力和加工都不知道语序。',
    mtiAnalogy: '像译文已经写完后才想起检查原文语序，很多关系已经被误解了。',
    hint: '在进入注意力和输出之前，先补上 Position Encoding。',
  },
  {
    id: 'feed-forward-before-attention',
    from: 'feed-forward',
    to: 'multi-head-attention',
    title: '为什么不能先加工再多角度看上下文？',
    explanation: 'Feed Forward 负责继续加工已经汇总过的信息，前面需要先完成多视角注意力判断。',
    mtiAnalogy: '像译员还没审清上下文关系就开始润色，很容易把错误理解打磨得更像真的。',
    hint: '先让 Multi-Head Attention 多角度审句，再进入后续加工。',
  },
];

export function findMisconception(from: string, to: string) {
  return misconceptions.find((misconception) => misconception.from === from && misconception.to === to);
}
