import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';

import English from './locales/en';
import Arabic from './locales/ar';

const resources = {
  en: English,
  ar: Arabic,
};

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  supportedLngs: ['en', 'ar'],
});

export default i18n;
