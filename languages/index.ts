
import { TranslationDictionary } from './types';
import { en } from './en';
import { ru } from './ru';
import { es } from './es';
import { zh } from './zh';
import { hi } from './hi';

export type LanguageCode = 'en' | 'ru' | 'es' | 'zh' | 'hi';

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  flag: string;
}

export const languages: LanguageOption[] = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
];

export const translations: Record<LanguageCode, TranslationDictionary> = {
  en,
  ru,
  es,
  zh,
  hi,
};

export * from './types';
