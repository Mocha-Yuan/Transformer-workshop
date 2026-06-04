import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { LANGUAGE_STORAGE_KEY, translateToEnglish, type Language } from './translations';

interface I18nContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (text: string) => string;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);
const originalTextByNode = new WeakMap<Text, string>();
const originalAttributeByElement = new WeakMap<Element, Map<string, string>>();
const translatedAttributes = ['aria-label', 'title', 'placeholder', 'alt'];
const hanTextPattern = /[\u4e00-\u9fff]/;

function getInitialLanguage(): Language {
  if (typeof window === 'undefined') {
    return 'zh';
  }

  const savedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);

  return savedLanguage === 'en' ? 'en' : 'zh';
}

function shouldSkipTextNode(node: Text) {
  const parentElement = node.parentElement;

  if (!parentElement) {
    return true;
  }

  return ['SCRIPT', 'STYLE', 'TEXTAREA', 'CODE'].includes(parentElement.tagName);
}

function translateTextNode(node: Text, language: Language, restoreOriginal = false) {
  if (shouldSkipTextNode(node)) {
    return;
  }

  const currentText = node.data;
  const savedOriginal = originalTextByNode.get(node);

  if (language === 'zh') {
    if (restoreOriginal && savedOriginal && currentText === translateToEnglish(savedOriginal)) {
      node.data = savedOriginal;
      return;
    }

    originalTextByNode.set(node, currentText);
    return;
  }

  if (!savedOriginal) {
    originalTextByNode.set(node, currentText);
  } else if (
    hanTextPattern.test(currentText) &&
    currentText !== translateToEnglish(savedOriginal) &&
    currentText !== savedOriginal
  ) {
    originalTextByNode.set(node, currentText);
  }

  const originalText = originalTextByNode.get(node) ?? currentText;

  if (!hanTextPattern.test(currentText) && currentText !== translateToEnglish(originalText)) {
    if (!savedOriginal || !hanTextPattern.test(savedOriginal)) {
      originalTextByNode.set(node, currentText);
    }

    return;
  }

  const nextText = language === 'en' ? translateToEnglish(originalText) : originalText;

  if (node.data !== nextText) {
    node.data = nextText;
  }
}

function translateElementAttributes(element: Element, language: Language) {
  let originalAttributes = originalAttributeByElement.get(element);

  if (!originalAttributes) {
    originalAttributes = new Map<string, string>();
    originalAttributeByElement.set(element, originalAttributes);
  }

  for (const attributeName of translatedAttributes) {
    const currentValue = element.getAttribute(attributeName);

    if (!currentValue) {
      continue;
    }

    if (!originalAttributes.has(attributeName)) {
      originalAttributes.set(attributeName, currentValue);
    } else if (
      language === 'en' &&
      currentValue !== translateToEnglish(originalAttributes.get(attributeName) ?? '') &&
      currentValue !== originalAttributes.get(attributeName)
    ) {
      originalAttributes.set(attributeName, currentValue);
    }

    const originalValue = originalAttributes.get(attributeName) ?? currentValue;
    const nextValue = language === 'en' ? translateToEnglish(originalValue) : originalValue;

    if (currentValue !== nextValue) {
      element.setAttribute(attributeName, nextValue);
    }
  }
}

function applyTranslations(root: Node, language: Language, restoreOriginal = false) {
  if (root.nodeType === Node.TEXT_NODE) {
    translateTextNode(root as Text, language, restoreOriginal);
    return;
  }

  if (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_FRAGMENT_NODE) {
    return;
  }

  if (root.nodeType === Node.ELEMENT_NODE) {
    translateElementAttributes(root as Element, language);
  }

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
  let currentNode = walker.nextNode();

  while (currentNode) {
    if (currentNode.nodeType === Node.TEXT_NODE) {
      translateTextNode(currentNode as Text, language, restoreOriginal);
    } else if (currentNode.nodeType === Node.ELEMENT_NODE) {
      translateElementAttributes(currentNode as Element, language);
    }

    currentNode = walker.nextNode();
  }
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(getInitialLanguage);
  const contextValue = useMemo(
    () => ({
      language,
      setLanguage,
      t: (text: string) => (language === 'en' ? translateToEnglish(text) : text),
    }),
    [language],
  );

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    let isApplying = false;

    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
    document.body.dataset.language = language;
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);

    function applyBodyTranslations() {
      isApplying = true;
      applyTranslations(document.body, language, true);
      isApplying = false;
    }

    applyBodyTranslations();

    const observer = new MutationObserver((mutations) => {
      if (isApplying) {
        return;
      }

      window.requestAnimationFrame(() => {
        isApplying = true;

        for (const mutation of mutations) {
          if (mutation.type === 'characterData') {
            applyTranslations(mutation.target, language);
          }

          mutation.addedNodes.forEach((node) => applyTranslations(node, language));

          if (mutation.type === 'attributes') {
            applyTranslations(mutation.target, language);
          }
        }

        isApplying = false;
      });
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: translatedAttributes,
      characterData: true,
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, [language]);

  return <I18nContext.Provider value={contextValue}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error('useI18n must be used inside I18nProvider');
  }

  return context;
}
