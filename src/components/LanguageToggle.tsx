import { useI18n } from '../i18n/I18nProvider';
import type { Language } from '../i18n/translations';

const languageOptions: Array<{ label: string; value: Language }> = [
  { label: '中文', value: 'zh' },
  { label: 'EN', value: 'en' },
];

export function LanguageToggle() {
  const { language, setLanguage } = useI18n();

  return (
    <div className="language-toggle" aria-label="语言">
      {languageOptions.map((option) => (
        <button
          aria-pressed={language === option.value}
          className={language === option.value ? 'is-active' : undefined}
          key={option.value}
          onClick={() => setLanguage(option.value)}
          type="button"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
