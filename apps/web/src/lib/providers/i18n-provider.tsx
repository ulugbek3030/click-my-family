'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { uz } from '../i18n/uz';
import { ru } from '../i18n/ru';
import { uzCyrl } from '../i18n/uz-cyrl';
import { type Locale, DEFAULT_LOCALE, LOCALES, type TranslationKeys } from '../i18n';

const translations: Record<Locale, TranslationKeys> = { uz, ru, 'uz-cyrl': uzCyrl };
const validLocales = LOCALES.map((l) => l.value) as string[];

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TranslationKeys;
}

const I18nContext = createContext<I18nContextType>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
  t: translations[DEFAULT_LOCALE],
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    const stored = localStorage.getItem('locale') as Locale | null;
    if (stored && validLocales.includes(stored)) {
      setLocaleState(stored);
    }
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('locale', newLocale);
  }, []);

  return (
    <I18nContext.Provider value={{ locale, setLocale, t: translations[locale] }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
