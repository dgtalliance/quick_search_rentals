import i18n from 'i18next'
import Backend from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import { flexGlobalSettings } from '../utils/constGlobals'
import { API_TRADUCCIONS_URL } from '../config/config'

const lang = flexGlobalSettings.params.default_language || 'en'

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    backend: {
      loadPath: `${API_TRADUCCIONS_URL}/3/${lang}`,
      allowMultiLoading: false,
    },
    fallbackLng: 'en',
    debug: false,
  })

export default i18n
