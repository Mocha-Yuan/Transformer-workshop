import { Handle, Position, type Node, type NodeProps } from '@xyflow/react';
import type { VisualNodeMeta } from '../../data/visualNodeMeta';
import { useI18n } from '../../i18n/I18nProvider';

export type VisualNodeStatus = 'idle' | 'active' | 'correct' | 'error';

export type PixelTransformerNodeData = Record<string, unknown> & {
  meta: VisualNodeMeta;
  isSelected: boolean;
  status: VisualNodeStatus;
};

export type PixelTransformerNodeType = Node<PixelTransformerNodeData, 'pixelTransformerNode'>;

const statusLabels: Record<VisualNodeStatus, string> = {
  idle: 'idle',
  active: 'next',
  correct: 'ok',
  error: 'warn',
};

export function PixelTransformerNode({ data }: NodeProps<PixelTransformerNodeType>) {
  const { t } = useI18n();

  return (
    <div
      className={`pixel-flow-node pixel-flow-node-${data.meta.zone} pixel-flow-node-status-${data.status}${
        data.isSelected ? ' is-selected' : ''
      }`}
    >
      <Handle className="pixel-flow-handle" type="target" position={Position.Left} />
      <Handle className="pixel-flow-handle" type="target" position={Position.Top} id="top" />
      <div className="pixel-flow-node-top">
        <span className="pixel-flow-icon" aria-hidden="true">
          {data.meta.icon}
        </span>
        <span className="pixel-flow-status">
          <span aria-hidden="true" />
          {statusLabels[data.status]}
        </span>
      </div>
      <strong>{t(data.meta.roleName)}</strong>
      <small>{data.meta.labelEn}</small>
      <p>{t(data.meta.oneLineLesson)}</p>
      <Handle className="pixel-flow-handle" type="source" position={Position.Right} />
      <Handle className="pixel-flow-handle" type="source" position={Position.Bottom} id="bottom" />
    </div>
  );
}
