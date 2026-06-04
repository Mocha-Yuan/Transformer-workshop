import type { DragEvent } from 'react';
import { useI18n } from '../i18n/I18nProvider';
import type { TransformerModule } from '../types/transformerModule';

interface ModuleCardProps {
  module: TransformerModule;
  isSelected: boolean;
  onSelect: (module: TransformerModule) => void;
  onDragStart: (module: TransformerModule, event: DragEvent<HTMLButtonElement>) => void;
}

export function ModuleCard({ module, isSelected, onSelect, onDragStart }: ModuleCardProps) {
  const { language, t } = useI18n();

  return (
    <button
      className={`module-card module-card-${module.color}${isSelected ? ' is-selected' : ''}`}
      draggable
      onDragStart={(event) => onDragStart(module, event)}
      onClick={() => onSelect(module)}
      type="button"
    >
      <span className="module-icon" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </span>
      <span className="module-copy">
        <span className="module-role-name">{t(module.roleName)}</span>
        <span className="module-name-zh">{language === 'en' ? module.nameEn : module.nameZh}</span>
        <span className="module-name-en">{module.nameEn}</span>
        <span className="module-summary">{t(module.summary)}</span>
        <span className="module-motto">{t(module.roleMotto)}</span>
        <span className="module-action-hint">{t('拖拽到搭建区 / 点击添加')}</span>
      </span>
    </button>
  );
}
