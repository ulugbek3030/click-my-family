export { uz, type TranslationKeys } from './uz';
export { ru } from './ru';

export type Locale = 'uz' | 'ru';
export const DEFAULT_LOCALE: Locale = 'ru';
export const LOCALES: { value: Locale; label: string }[] = [
  { value: 'uz', label: "O'zbek" },
  { value: 'ru', label: 'Русский' },
];
