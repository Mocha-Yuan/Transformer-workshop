const punctuationPattern = /^[，。！？；、,.!?;:]$/;
const latinPattern = /[A-Za-z0-9]/;
const chinesePattern = /[\u4e00-\u9fff]/;
const whitespacePattern = /\s/;

const teachingLexicon = [
  '机器翻译',
  '很有价值',
  '专业词',
  '术语表',
  '复杂句',
  '这本书',
  '陌生人',
  '很准确',
  '不够',
  '通顺',
  '喜欢',
  '学习',
  '翻译',
  '小猫',
  '小狗',
  '看见',
  '因为',
  '害怕',
  '妈妈',
  '蛋糕',
  '放进',
  '冰箱',
  '融化',
  '译员',
  '查了',
  '解释',
  '学生',
  '修改',
  '译文',
  '老师',
  '表扬',
  '小明',
  '虽然',
  '很难',
  '但是',
  '如果',
  '所以',
  '并且',
  '慢慢',
  '拆开',
  '原文',
  '句子',
  '模型',
  'Token',
  'Transformer',
  '会',
  '把',
  '也',
  '但',
  '它',
  '他',
  '她',
  '这',
  '那',
  '我',
  '很',
].sort((first, second) => second.length - first.length);

function readLatinToken(sentence: string, startIndex: number) {
  let endIndex = startIndex;

  while (endIndex < sentence.length && latinPattern.test(sentence[endIndex])) {
    endIndex += 1;
  }

  return sentence.slice(startIndex, endIndex);
}

function readTeachingChineseToken(sentence: string, startIndex: number) {
  const matchedWord = teachingLexicon.find((word) => sentence.startsWith(word, startIndex));

  if (matchedWord) {
    return matchedWord;
  }

  let endIndex = startIndex + 1;

  while (
    endIndex < sentence.length &&
    chinesePattern.test(sentence[endIndex]) &&
    !teachingLexicon.some((word) => sentence.startsWith(word, endIndex))
  ) {
    endIndex += 1;
  }

  return sentence.slice(startIndex, endIndex);
}

export function tokenizeForTeaching(sentence: string) {
  const tokens: string[] = [];
  const normalizedSentence = sentence.trim();
  let index = 0;

  while (index < normalizedSentence.length) {
    const currentChar = normalizedSentence[index];

    if (whitespacePattern.test(currentChar)) {
      index += 1;
      continue;
    }

    if (punctuationPattern.test(currentChar)) {
      tokens.push(currentChar);
      index += 1;
      continue;
    }

    if (latinPattern.test(currentChar)) {
      const token = readLatinToken(normalizedSentence, index);
      tokens.push(token);
      index += token.length;
      continue;
    }

    if (chinesePattern.test(currentChar)) {
      const token = readTeachingChineseToken(normalizedSentence, index);
      tokens.push(token);
      index += token.length;
      continue;
    }

    tokens.push(currentChar);
    index += 1;
  }

  return tokens;
}
