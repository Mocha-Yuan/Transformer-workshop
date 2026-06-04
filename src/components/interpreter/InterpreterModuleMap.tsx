import { visualNodeMeta } from '../../data/visualNodeMeta';

interface InterpreterModuleMapProps {
  highlightedModuleNames: string[];
}

export function InterpreterModuleMap({ highlightedModuleNames }: InterpreterModuleMapProps) {
  const highlightedSet = new Set(highlightedModuleNames);

  return (
    <section className="interpreter-module-map" aria-label="对应 Transformer 模块高亮区">
      <p className="screen-label">对应模块</p>
      <div className="interpreter-module-grid">
        {visualNodeMeta.map((meta) => (
          <div
            className={highlightedSet.has(meta.moduleName) ? 'interpreter-module is-highlighted' : 'interpreter-module'}
            key={meta.id}
          >
            <span>{meta.icon}</span>
            <strong>{meta.labelZh}</strong>
            <small>{meta.labelEn}</small>
          </div>
        ))}
      </div>
    </section>
  );
}
