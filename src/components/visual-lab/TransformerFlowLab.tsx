import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
  ViewportPortal,
  type Connection,
  type Edge,
  type EdgeChange,
  type NodeChange,
  type NodeMouseHandler,
  type NodeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { PixelButton } from '../PixelButton';
import { visualNodeMeta } from '../../data/visualNodeMeta';
import { useI18n } from '../../i18n/I18nProvider';
import type { GameMode, LevelMission } from '../../types/game';
import { recordMistakeReview } from '../../utils/mistakeReviewStorage';
import {
  validateFlowConnections,
  type FlowValidationResult,
} from '../../utils/validateFlowConnections';
import { DataPacketAnimation } from './DataPacketAnimation';
import { FlowFeedbackPanel } from './FlowFeedbackPanel';
import {
  PixelTransformerNode,
  type PixelTransformerNodeType,
  type VisualNodeStatus,
} from './PixelTransformerNode';
import './visualLab.css';

const nodeTypes: NodeTypes = {
  pixelTransformerNode: PixelTransformerNode,
};

const nodePositions: Record<string, { x: number; y: number }> = {
  token: { x: 40, y: 260 },
  embedding: { x: 320, y: 260 },
  'position-encoding': { x: 600, y: 260 },
  query: { x: 640, y: 20 },
  key: { x: 880, y: 20 },
  value: { x: 1120, y: 20 },
  'self-attention': { x: 900, y: 300 },
  'multi-head-attention': { x: 1180, y: 300 },
  'add-norm': { x: 1460, y: 260 },
  'feed-forward': { x: 1740, y: 260 },
  output: { x: 2020, y: 260 },
};

const moduleNameByNodeId = new Map(visualNodeMeta.map((meta) => [meta.id, meta.moduleName]));
const nodeIdByModuleName = new Map(visualNodeMeta.map((meta) => [meta.moduleName, meta.id]));
const labelByModuleName = new Map(visualNodeMeta.map((meta) => [meta.moduleName, meta.labelZh]));

type VisualZone = 'input' | 'encoding' | 'attention' | 'processing' | 'output';

const moduleZoneMap: Record<string, VisualZone> = {
  Token: 'input',
  Embedding: 'encoding',
  'Position Encoding': 'encoding',
  Query: 'attention',
  Key: 'attention',
  Value: 'attention',
  'Self-Attention': 'attention',
  'Multi-Head Attention': 'attention',
  'Add & Norm': 'processing',
  'Feed Forward': 'processing',
  Output: 'output',
};

const zoneLabels: Record<VisualZone, string> = {
  input: '输入区',
  encoding: '编码区',
  attention: '注意力区',
  processing: '加工区',
  output: '输出区',
};

type SavedNodeLayout = Record<string, { x: number; y: number }>;

const edgeBaseStyle: CSSProperties = {
  stroke: '#52e6ff',
  strokeWidth: 3,
};

const correctEdgeStyle: CSSProperties = {
  stroke: '#7cf77f',
  strokeWidth: 4,
};

const wrongEdgeStyle: CSSProperties = {
  stroke: '#ff5f8f',
  strokeWidth: 4,
};

export interface TransformerFlowLabProps {
  targetSequence: string[];
  mode: GameMode;
  levelId: string;
  levelTitle: string;
  onComplete?: () => void;
  onMistake?: () => void;
  onBackToPracticeSelect?: () => void;
  onBackHome?: () => void;
  resetSignal?: number;
  embedded?: boolean;
  mission?: LevelMission;
  randomizeInitialLayout?: boolean;
}

function createConnectionKey(sourceId: string, targetId: string) {
  const sourceName = moduleNameByNodeId.get(sourceId) ?? sourceId;
  const targetName = moduleNameByNodeId.get(targetId) ?? targetId;

  return `${sourceName}->${targetName}`;
}

function getConnectedModuleNames(connectionKeys: string[]) {
  return connectionKeys.flatMap((connectionKey) => connectionKey.split('->'));
}

function getNodeStatus(metaModuleName: string, validation: FlowValidationResult): VisualNodeStatus {
  const wrongModules = new Set(getConnectedModuleNames(validation.wrongConnectionKeys));

  if (wrongModules.has(metaModuleName)) {
    return 'error';
  }

  const correctModules = new Set(getConnectedModuleNames(validation.correctConnectionKeys));

  if (correctModules.has(metaModuleName)) {
    return 'correct';
  }

  if (
    validation.nextExpectedConnection &&
    (validation.nextExpectedConnection.source === metaModuleName ||
      validation.nextExpectedConnection.target === metaModuleName)
  ) {
    return 'active';
  }

  return 'idle';
}

function hasAttentionStep(targetSequence: string[], connectionKeys: string[]) {
  return [...targetSequence, ...getConnectedModuleNames(connectionKeys)].some((moduleName) => {
    return moduleName === 'Self-Attention' || moduleName === 'Multi-Head Attention';
  });
}

function getLayoutStorageKey(mode: GameMode, levelId: string) {
  return `transformer_node_layout_${mode}_${levelId}`;
}

function loadSavedNodeLayout(storageKey: string): SavedNodeLayout {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    const savedLayout = JSON.parse(window.localStorage.getItem(storageKey) ?? '{}');

    if (!savedLayout || typeof savedLayout !== 'object') {
      return {};
    }

    return savedLayout as SavedNodeLayout;
  } catch {
    return {};
  }
}

function saveNodeLayout(storageKey: string, nodes: PixelTransformerNodeType[]) {
  if (typeof window === 'undefined') {
    return;
  }

  const layout = nodes.reduce<SavedNodeLayout>((savedLayout, node) => {
    savedLayout[node.id] = node.position;
    return savedLayout;
  }, {});

  window.localStorage.setItem(storageKey, JSON.stringify(layout));
}

function clearSavedNodeLayout(storageKey: string) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(storageKey);
}

function createVisualNodes(savedLayout: SavedNodeLayout = {}): PixelTransformerNodeType[] {
  return visualNodeMeta.map((meta) => ({
    id: meta.id,
    type: 'pixelTransformerNode',
    position: savedLayout[meta.id] ?? nodePositions[meta.id],
    draggable: true,
    data: {
      isSelected: false,
      meta,
      status: 'idle',
    },
  }));
}

function createRandomLayout(): SavedNodeLayout {
  const basePositions = visualNodeMeta.map((meta) => nodePositions[meta.id]);
  const shiftedPositions = basePositions
    .map((position, index) => ({
      x: position.x + ((index % 3) - 1) * 40,
      y: position.y + ((index % 4) - 1.5) * 34,
    }))
    .sort(() => Math.random() - 0.5);

  return visualNodeMeta.reduce<SavedNodeLayout>((layout, meta, index) => {
    layout[meta.id] = shiftedPositions[index] ?? nodePositions[meta.id];
    return layout;
  }, {});
}

function getAutoLayoutPositions(targetSequence: string[]): SavedNodeLayout {
  const targetIndex = new Map(targetSequence.map((moduleName, index) => [moduleName, index]));
  const zoneColumns: Record<VisualZone, number> = {
    input: 40,
    encoding: 330,
    attention: 690,
    processing: 1280,
    output: 1860,
  };
  const zoneStartRows: Record<VisualZone, number> = {
    input: 260,
    encoding: 190,
    attention: 20,
    processing: 190,
    output: 260,
  };
  const modulesByZone = visualNodeMeta.reduce<Record<VisualZone, typeof visualNodeMeta>>(
    (zones, meta) => {
      zones[moduleZoneMap[meta.moduleName]].push(meta);
      return zones;
    },
    { input: [], encoding: [], attention: [], processing: [], output: [] },
  );

  return (Object.keys(modulesByZone) as VisualZone[]).reduce<SavedNodeLayout>((layout, zone) => {
    modulesByZone[zone]
      .slice()
      .sort((first, second) => {
        const firstIndex = targetIndex.get(first.moduleName) ?? 999;
        const secondIndex = targetIndex.get(second.moduleName) ?? 999;
        return firstIndex - secondIndex;
      })
      .forEach((meta, index) => {
        layout[meta.id] = {
          x: zoneColumns[zone],
          y: zoneStartRows[zone] + index * 170,
        };
      });

    return layout;
  }, {});
}

function getActiveZoneGuides(targetSequence: string[], nodes: PixelTransformerNodeType[]) {
  const nodePositionById = new Map(nodes.map((node) => [node.id, node.position]));
  const modulesByZone = targetSequence.reduce<Record<VisualZone, string[]>>(
    (zones, moduleName) => {
      const zone = moduleZoneMap[moduleName];

      if (zone && !zones[zone].includes(moduleName)) {
        zones[zone].push(moduleName);
      }

      return zones;
    },
    { input: [], encoding: [], attention: [], processing: [], output: [] },
  );

  return (Object.keys(modulesByZone) as VisualZone[]).flatMap((zone) => {
    const positions = modulesByZone[zone]
      .map((moduleName) => nodeIdByModuleName.get(moduleName))
      .map((nodeId) => (nodeId ? nodePositionById.get(nodeId) : undefined))
      .filter((position): position is { x: number; y: number } => Boolean(position));

    if (positions.length === 0) {
      return [];
    }

    const minX = Math.min(...positions.map((position) => position.x));
    const maxX = Math.max(...positions.map((position) => position.x));
    const minY = Math.min(...positions.map((position) => position.y));
    const maxY = Math.max(...positions.map((position) => position.y));

    return [
      {
        height: Math.max(210, maxY - minY + 190),
        label: zoneLabels[zone],
        width: Math.max(230, maxX - minX + 230),
        x: minX - 20,
        y: minY - 50,
        zone,
      },
    ];
  });
}

export function TransformerFlowLab({
  targetSequence,
  mode,
  levelId,
  levelTitle,
  onComplete,
  onMistake,
  onBackToPracticeSelect,
  onBackHome,
  resetSignal = 0,
  embedded = false,
  mission,
  randomizeInitialLayout = false,
}: TransformerFlowLabProps) {
  const { language, t } = useI18n();
  const layoutStorageKey = useMemo(() => getLayoutStorageKey(mode, levelId), [levelId, mode]);
  const [nodes, setNodes] = useState<PixelTransformerNodeType[]>(() => {
    return createVisualNodes(randomizeInitialLayout ? createRandomLayout() : loadSavedNodeLayout(layoutStorageKey));
  });
  const [edges, setEdges] = useState<Edge[]>([]);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [selectedModuleName, setSelectedModuleName] = useState<string>();
  const [isClickConnectMode, setIsClickConnectMode] = useState(false);
  const [isFlowPanelCollapsed, setIsFlowPanelCollapsed] = useState(false);
  const [pendingSourceNodeId, setPendingSourceNodeId] = useState<string>();
  const [demoStepIndex, setDemoStepIndex] = useState(-1);
  const [demoMessage, setDemoMessage] = useState('');
  const [isDemoPlaying, setIsDemoPlaying] = useState(false);
  const [wrongAttemptCount, setWrongAttemptCount] = useState(0);
  const lastRecordedMisconceptionId = useRef<string | undefined>(undefined);
  const lastWrongConnectionCount = useRef(0);

  const validation = useMemo(
    () => validateFlowConnections(edges, targetSequence),
    [edges, targetSequence],
  );
  const targetConnectionCount = Math.max(targetSequence.length - 1, 0);
  const progressText =
    language === 'en'
      ? `Connected: ${validation.correctConnectionKeys.length} / ${targetConnectionCount}`
      : `已连接：${validation.correctConnectionKeys.length} / ${targetConnectionCount}`;
  const showAttentionMatrix = hasAttentionStep(targetSequence, validation.correctConnectionKeys);
  const activeZoneGuides = useMemo(() => getActiveZoneGuides(targetSequence, nodes), [nodes, targetSequence]);

  const styledEdges = useMemo(
    () =>
      edges.map((edge) => {
        const connectionKey = createConnectionKey(edge.source, edge.target);
        const isCorrect = validation.correctConnectionKeys.includes(connectionKey);
        const isWrong = validation.wrongConnectionKeys.includes(connectionKey);
        const isCompleteEdge = validation.isComplete && isCorrect;

        return {
          ...edge,
          animated: isCorrect,
          className: isWrong
            ? 'flow-edge-error'
            : isCompleteEdge
              ? 'flow-edge-correct flow-edge-complete'
              : isCorrect
                ? 'flow-edge-correct'
                : 'flow-edge-idle',
          style: isWrong ? wrongEdgeStyle : isCorrect ? correctEdgeStyle : edgeBaseStyle,
        };
      }),
    [edges, validation.correctConnectionKeys, validation.isComplete, validation.wrongConnectionKeys],
  );

  useEffect(() => {
    setNodes(createVisualNodes(randomizeInitialLayout ? createRandomLayout() : loadSavedNodeLayout(layoutStorageKey)));
    setEdges([]);
    setHasCompleted(false);
    setPendingSourceNodeId(undefined);
    setDemoStepIndex(-1);
    setDemoMessage('');
    setIsDemoPlaying(false);
    lastWrongConnectionCount.current = 0;
    setWrongAttemptCount(0);
  }, [layoutStorageKey, randomizeInitialLayout, resetSignal, setNodes, targetSequence]);

  useEffect(() => {
    if (!isDemoPlaying) {
      return;
    }

    if (targetSequence.length < 2) {
      setIsDemoPlaying(false);
      return;
    }

    if (demoStepIndex >= targetSequence.length - 1) {
      const timer = window.setTimeout(() => {
        setEdges([]);
        setHasCompleted(false);
        setDemoStepIndex(-1);
        setDemoMessage(
          language === 'en'
            ? 'Demo complete: the answer lines are hidden. Now it is your turn to connect the flow.'
            : '演示结束：答案线已经收起。现在轮到你亲手连接一次。',
        );
        setIsDemoPlaying(false);
      }, 1100);

      return () => window.clearTimeout(timer);
    }

    const timer = window.setTimeout(() => {
      const sourceModuleName = targetSequence[demoStepIndex];
      const targetModuleName = targetSequence[demoStepIndex + 1];
      const sourceId = nodeIdByModuleName.get(sourceModuleName);
      const targetId = nodeIdByModuleName.get(targetModuleName);

      if (sourceId && targetId) {
        setEdges((currentEdges) => {
          const alreadyExists = currentEdges.some((edge) => edge.source === sourceId && edge.target === targetId);

          if (alreadyExists) {
            return currentEdges;
          }

          return addEdge(
            {
              id: `demo-${sourceId}-${targetId}-${demoStepIndex}`,
              source: sourceId,
              target: targetId,
              type: 'smoothstep',
              animated: true,
              deletable: true,
              focusable: true,
              selectable: true,
              style: correctEdgeStyle,
            },
            currentEdges,
          );
        });
        setDemoMessage(
          language === 'en'
            ? `Demo step ${demoStepIndex + 1}: ${sourceModuleName} flows to ${targetModuleName}.`
            : `演示第 ${demoStepIndex + 1} 步：${labelByModuleName.get(sourceModuleName) ?? sourceModuleName} 流向 ${
                labelByModuleName.get(targetModuleName) ?? targetModuleName
              }。`,
        );
      }

      setDemoStepIndex((index) => index + 1);
    }, 850);

    return () => window.clearTimeout(timer);
  }, [demoStepIndex, isDemoPlaying, language, targetSequence]);

  useEffect(() => {
    setNodes((currentNodes) =>
      currentNodes.map((node) => {
        const meta = visualNodeMeta.find((item) => item.id === node.id);

        if (!meta) {
          return node;
        }

        return {
          ...node,
          draggable: true,
          data: {
            isSelected: selectedModuleName === meta.moduleName || pendingSourceNodeId === meta.id,
            meta,
            status: getNodeStatus(meta.moduleName, validation),
          },
        };
      }),
    );
  }, [pendingSourceNodeId, selectedModuleName, setNodes, validation]);

  useEffect(() => {
    if (isDemoPlaying) {
      return;
    }

    if (validation.isComplete && !hasCompleted) {
      setHasCompleted(true);
      onComplete?.();
    }
  }, [hasCompleted, isDemoPlaying, onComplete, validation.isComplete]);

  useEffect(() => {
    const misconceptionId = validation.activeMisconception?.id;

    if (!misconceptionId) {
      lastRecordedMisconceptionId.current = undefined;
      return;
    }

    if (lastRecordedMisconceptionId.current === misconceptionId) {
      return;
    }

    recordMistakeReview(misconceptionId);
    lastRecordedMisconceptionId.current = misconceptionId;
  }, [validation.activeMisconception?.id]);

  useEffect(() => {
    if (validation.wrongConnectionKeys.length <= lastWrongConnectionCount.current) {
      lastWrongConnectionCount.current = validation.wrongConnectionKeys.length;
      return;
    }

    lastWrongConnectionCount.current = validation.wrongConnectionKeys.length;
    setWrongAttemptCount((count) => count + 1);
    onMistake?.();
  }, [onMistake, validation.wrongConnectionKeys.length]);

  function addConnection(source: string, target: string, sourceHandle?: string | null, targetHandle?: string | null) {
    setEdges((currentEdges) => {
      const alreadyExists = currentEdges.some((edge) => edge.source === source && edge.target === target);

      if (alreadyExists) {
        return currentEdges;
      }

      return addEdge(
        {
          id: `${source}-${target}-${Date.now()}`,
          source,
          sourceHandle,
          target,
          targetHandle,
          type: 'smoothstep',
          animated: false,
          deletable: true,
          focusable: true,
          selectable: true,
          style: edgeBaseStyle,
        },
        currentEdges,
      );
    });
  }

  function handleConnect(connection: Connection) {
    if (!connection.source || !connection.target) {
      return;
    }

    addConnection(connection.source, connection.target, connection.sourceHandle, connection.targetHandle);
  }

  function handleEdgesChange(changes: EdgeChange[]) {
    setEdges((currentEdges) => applyEdgeChanges(changes, currentEdges));
  }

  function handleNodesChange(changes: NodeChange<PixelTransformerNodeType>[]) {
    setNodes((currentNodes) => applyNodeChanges<PixelTransformerNodeType>(changes, currentNodes));
  }

  function handleNodeDragStop(
    _event: unknown,
    _node: PixelTransformerNodeType,
    draggedNodes: PixelTransformerNodeType[],
  ) {
    saveNodeLayout(layoutStorageKey, draggedNodes);
  }

  const handleNodeClick: NodeMouseHandler<PixelTransformerNodeType> = (_event, node) => {
    const moduleName = moduleNameByNodeId.get(node.id);
    setSelectedModuleName(moduleName);

    if (!isClickConnectMode) {
      return;
    }

    if (!pendingSourceNodeId) {
      setPendingSourceNodeId(node.id);
      return;
    }

    if (pendingSourceNodeId === node.id) {
      setPendingSourceNodeId(undefined);
      return;
    }

    addConnection(pendingSourceNodeId, node.id);
    setPendingSourceNodeId(undefined);
  };

  function handleResetConnections() {
    setEdges([]);
    setHasCompleted(false);
    setPendingSourceNodeId(undefined);
  }

  function handleRestoreDefaultLayout() {
    clearSavedNodeLayout(layoutStorageKey);
    setNodes(createVisualNodes());
  }

  function handleAutoLayout() {
    const nextNodes = createVisualNodes(getAutoLayoutPositions(targetSequence));
    setNodes(nextNodes);
    saveNodeLayout(layoutStorageKey, nextNodes);
  }

  function handleToggleClickConnectMode() {
    setIsClickConnectMode((current) => !current);
    setPendingSourceNodeId(undefined);
  }

  function handleStartDemoMode() {
    setEdges([]);
    setHasCompleted(false);
    setPendingSourceNodeId(undefined);
    setIsClickConnectMode(false);
    setWrongAttemptCount(0);
    setDemoStepIndex(0);
    setDemoMessage(
      language === 'en'
        ? 'Demo started: watch the correct path first. The answer will be hidden shortly.'
        : '演示开始：先看一遍正确线路，稍后系统会收起答案。',
    );
    setIsDemoPlaying(true);
  }

  const nextExpectedConnection = validation.nextExpectedConnection;
  const nextStepText = nextExpectedConnection
    ? language === 'en'
      ? `Next, try connecting: ${nextExpectedConnection.source} -> ${nextExpectedConnection.target}.`
      : `下一步试着连接：${nextExpectedConnection.source} → ${nextExpectedConnection.target}。`
    : undefined;
  const pageClassName = embedded ? 'visual-lab-page visual-lab-page-embedded' : 'visual-lab-page';

  return (
    <section className={pageClassName}>
      <header className="visual-lab-header">
        <div>
          <p className="screen-label">{t(mode === 'practice' ? '自由练习画布' : '闯关连接画布')}</p>
          <h1>{t('Transformer 可视化工坊')}</h1>
          <p>{t('在这里，你将像连接机器一样理解 Transformer 的信息流动。')}</p>
        </div>
        <div className="visual-lab-header-actions">
          <PixelButton onClick={handleToggleClickConnectMode}>
            {t(isClickConnectMode ? '关闭点击连接' : '点击连接模式')}
          </PixelButton>
          <PixelButton onClick={handleStartDemoMode}>{t(isDemoPlaying ? '正在演示' : '先看答案演示')}</PixelButton>
          <PixelButton onClick={handleResetConnections}>{t('重置连接')}</PixelButton>
          <PixelButton onClick={handleRestoreDefaultLayout}>{t('恢复默认布局')}</PixelButton>
          <PixelButton onClick={handleAutoLayout}>{t('自动整理布局')}</PixelButton>
          {onBackToPracticeSelect ? <PixelButton onClick={onBackToPracticeSelect}>{t('选择其他练习')}</PixelButton> : null}
          {onBackHome ? <PixelButton onClick={onBackHome}>{t('返回首页')}</PixelButton> : null}
        </div>
      </header>

      <section
        className={isFlowPanelCollapsed ? 'visual-lab-shell is-flow-panel-collapsed' : 'visual-lab-shell'}
        aria-label="Transformer 可连接画布"
      >
        <div className="visual-lab-canvas-panel">
          <DataPacketAnimation
            activeModuleName={validation.nextExpectedConnection?.source}
            correctConnectionCount={validation.correctConnectionKeys.length}
            isComplete={validation.isComplete}
            wrongConnectionCount={validation.wrongConnectionKeys.length}
          />
          <p className="drag-layout-tip">{t('你可以拖动模块，整理自己的 Transformer 工作台布局。')}</p>
          {isClickConnectMode ? (
            <p className="click-connect-tip">
              {language === 'en'
                ? `Click-connect mode: ${
                    pendingSourceNodeId ? 'choose an endpoint module; click the start again to cancel.' : 'choose a start module, then an endpoint module.'
                  }`
                : `点击连接模式：${pendingSourceNodeId ? '请选择终点模块；再次点击起点可取消。' : '请先选择起点模块，再选择终点模块。'}`}
            </p>
          ) : null}
          {nextStepText ? <p className="visual-next-step">{nextStepText}</p> : null}
          {demoMessage ? <p className={isDemoPlaying ? 'visual-demo-message is-playing' : 'visual-demo-message'}>{demoMessage}</p> : null}
          <div className={wrongAttemptCount >= 3 ? 'ghost-target-path is-guided' : 'ghost-target-path'} aria-hidden="true">
            {targetSequence.map((moduleName, index) => {
              const nextModuleName = targetSequence[index + 1];
              const connectionKey = nextModuleName ? `${moduleName}->${nextModuleName}` : undefined;
              const isConnected = connectionKey ? validation.correctConnectionKeys.includes(connectionKey) : false;

              return (
                <span className={isConnected ? 'is-connected' : undefined} key={`${moduleName}-${index}`}>
                  {moduleName}
                </span>
              );
            })}
          </div>
          <div className="visual-lab-canvas">
            <ReactFlow
              nodes={nodes}
              edges={styledEdges}
              nodeTypes={nodeTypes}
              onConnect={handleConnect}
              onEdgesChange={handleEdgesChange}
              onNodeDragStop={handleNodeDragStop}
              onNodeClick={handleNodeClick}
              onNodesChange={handleNodesChange}
              fitView
              fitViewOptions={{ padding: 0.18 }}
              minZoom={0.35}
              maxZoom={1.4}
              nodesDraggable
              nodesConnectable
              elementsSelectable
              deleteKeyCode={['Backspace', 'Delete']}
            >
              <ViewportPortal>
                {activeZoneGuides.map((guide) => (
                  <div
                    className={`zone-guide zone-guide-${guide.zone}`}
                    key={guide.zone}
                    style={{
                      height: guide.height,
                      transform: `translate(${guide.x}px, ${guide.y}px)`,
                      width: guide.width,
                    }}
                  >
                    <span>{t(guide.label)}</span>
                  </div>
                ))}
              </ViewportPortal>
              <Background color="#35446f" gap={24} size={2} variant={BackgroundVariant.Lines} />
              <MiniMap
                className="visual-lab-minimap"
                maskColor="rgba(9, 11, 20, 0.62)"
                nodeColor={(node) => {
                  const moduleName = moduleNameByNodeId.get(node.id) ?? node.id;
                  const status = getNodeStatus(moduleName, validation);

                  if (status === 'correct') {
                    return '#7cf77f';
                  }

                  if (status === 'error') {
                    return '#ff5f8f';
                  }

                  if (status === 'active') {
                    return '#ffd166';
                  }

                  return '#52e6ff';
                }}
                pannable
                zoomable
              />
              <Controls className="visual-lab-controls" />
            </ReactFlow>
          </div>
        </div>

        {isFlowPanelCollapsed ? (
          <aside className="visual-lab-feedback visual-lab-feedback-collapsed" aria-label="可视化教学面板">
            <button
              aria-label="展开可视化教学面板"
              className="visual-feedback-tab"
              onClick={() => setIsFlowPanelCollapsed(false)}
              type="button"
            >
              {t('说明')}
            </button>
          </aside>
        ) : (
          <FlowFeedbackPanel
            feedbackMessage={t(validation.feedbackMessage)}
            levelTitle={t(levelTitle)}
            misconception={validation.activeMisconception}
            mission={mission}
            mode={mode}
            nextStepText={nextStepText}
            onCollapse={() => setIsFlowPanelCollapsed(true)}
            progressText={progressText}
            selectedModuleName={selectedModuleName}
            showAttentionMatrix={showAttentionMatrix}
            targetSequence={targetSequence}
            wrongAttemptCount={wrongAttemptCount}
          />
        )}
      </section>
    </section>
  );
}
