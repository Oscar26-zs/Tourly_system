import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../../Locales/en.json';
import es from '../../Locales/es.json';

const resources = {
  en: { translation: en },
  es: { translation: es },
};

const saved = typeof window !== 'undefined' ? localStorage.getItem('i18nextLng') : null;
const defaultLng = saved || (typeof navigator !== 'undefined' && navigator.language.startsWith('es') ? 'es' : 'en');

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: defaultLng,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  })
  .catch((e) => console.error('i18n init error', e));

export default i18n;
