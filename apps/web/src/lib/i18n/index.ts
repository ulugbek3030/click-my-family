export { uz, type TranslationKeys } from './uz';
export { ru } from './ru';
export { uzCyrl } from './uz-cyrl';

export type Locale = 'uz' | 'ru' | 'uz-cyrl';
export const DEFAULT_LOCALE: Locale = 'ru';
export const LOCALES: { value: Locale; label: string }[] = [
  { value: 'uz', label: "O'zbek" },
  { value: 'uz-cyrl', label: 'Ўзбек' },
  { value: 'ru', label: 'Русский' },
];
