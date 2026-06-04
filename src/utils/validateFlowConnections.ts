import type { Edge } from '@xyflow/react';
import { findMisconception, type Misconception } from '../data/misconceptions';
import { visualNodeMeta } from '../data/visualNodeMeta';

export type FlowValidationResult = {
  isComplete: boolean;
  correctConnectionKeys: string[];
  wrongConnectionKeys: string[];
  nextExpectedConnection?: {
    source: string;
    target: string;
  };
  feedbackMessage: string;
  activeMisconception?: Misconception;
};

const moduleNameByNodeId = new Map(visualNodeMeta.map((meta) => [meta.id, meta.moduleName]));
const labelByModuleName = new Map(visualNodeMeta.map((meta) => [meta.moduleName, meta.labelZh]));

function createConnectionKey(source: string, target: string) {
  return `${source}->${target}`;
}

function getLabel(moduleName: string) {
  return labelByModuleName.get(moduleName) ?? moduleName;
}

export function validateFlowConnections(edges: Edge[], targetSequence: string[]): FlowValidationResult {
  if (targetSequence.length < 2) {
    return {
      isComplete: false,
      correctConnectionKeys: [],
      wrongConnectionKeys: [],
      feedbackMessage: '先选择一个完整任务。',
    };
  }

  const expectedConnectionKeys = targetSequence.slice(0, -1).map((source, index) => {
    return createConnectionKey(source, targetSequence[index + 1]);
  });
  const expectedConnectionSet = new Set(expectedConnectionKeys);
  const actualConnectionKeys = edges.map((edge) => {
    const sourceName = moduleNameByNodeId.get(edge.source) ?? edge.source;
    const targetName = moduleNameByNodeId.get(edge.target) ?? edge.target;
    return createConnectionKey(sourceName, targetName);
  });
  const correctConnectionKeys = expectedConnectionKeys.filter((connectionKey) => {
    return actualConnectionKeys.includes(connectionKey);
  });
  const wrongConnectionKeys = actualConnectionKeys.filter((connectionKey) => {
    return !expectedConnectionSet.has(connectionKey);
  });
  const wrongEdges = edges.filter((edge) => {
    const sourceName = moduleNameByNodeId.get(edge.source) ?? edge.source;
    const targetName = moduleNameByNodeId.get(edge.target) ?? edge.target;

    return !expectedConnectionSet.has(createConnectionKey(sourceName, targetName));
  });
  const nextConnectionKey = expectedConnectionKeys.find((connectionKey) => {
    return !correctConnectionKeys.includes(connectionKey);
  });
  const nextExpectedConnection = nextConnectionKey
    ? {
        source: nextConnectionKey.split('->')[0],
        target: nextConnectionKey.split('->')[1],
      }
    : undefined;
  const isComplete = correctConnectionKeys.length === expectedConnectionKeys.length && wrongConnectionKeys.length === 0;

  if (wrongConnectionKeys.length > 0) {
    const lastWrongEdge = wrongEdges[wrongEdges.length - 1];
    const activeMisconception = lastWrongEdge ? findMisconception(lastWrongEdge.source, lastWrongEdge.target) : undefined;

    return {
      isComplete: false,
      correctConnectionKeys,
      wrongConnectionKeys,
      nextExpectedConnection,
      activeMisconception,
      feedbackMessage: activeMisconception ? activeMisconception.hint : '这条线顺序不对，删掉后按目标顺序重连。',
    };
  }

  if (isComplete) {
    return {
      isComplete: true,
      correctConnectionKeys,
      wrongConnectionKeys,
      feedbackMessage: '流程接通了。',
    };
  }

  if (correctConnectionKeys.length > 0) {
    const [source, target] = correctConnectionKeys[correctConnectionKeys.length - 1].split('->');
    return {
      isComplete: false,
      correctConnectionKeys,
      wrongConnectionKeys,
      nextExpectedConnection,
      feedbackMessage: `已连接：${getLabel(source)} → ${getLabel(target)}。`,
    };
  }

  return {
    isComplete: false,
    correctConnectionKeys,
    wrongConnectionKeys,
    nextExpectedConnection,
    feedbackMessage: nextExpectedConnection
      ? `先连接：${nextExpectedConnection.source} → ${nextExpectedConnection.target}。`
      : '从目标序列的第一对节点开始。',
  };
}
