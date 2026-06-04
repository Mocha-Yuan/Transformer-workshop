interface DataPacketAnimationProps {
  activeModuleName?: string;
  correctConnectionCount: number;
  isComplete: boolean;
  wrongConnectionCount: number;
}

export function DataPacketAnimation({
  activeModuleName,
  correctConnectionCount,
  isComplete,
  wrongConnectionCount,
}: DataPacketAnimationProps) {
  if (correctConnectionCount === 0 && wrongConnectionCount === 0 && !isComplete) {
    return null;
  }

  const isWarning = wrongConnectionCount > 0;

  return (
    <div
      className={`data-packet-banner${isComplete ? ' is-complete' : ''}${isWarning ? ' is-warning' : ''}`}
      aria-live="polite"
    >
      <div className="data-packet-rail" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <p>
        {isWarning
          ? '这条线卡住了，删掉后重连。'
          : isComplete
            ? '流程接通了。'
            : `已接通 ${correctConnectionCount} 条${activeModuleName ? `，正在经过 ${activeModuleName}` : ''}。`}
      </p>
    </div>
  );
}
