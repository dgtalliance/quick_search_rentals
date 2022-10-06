import React, { useState } from 'react'
// import localeEn from '../lang/en_EN.json'
import localeIt from '../lang/it_IT.json'
// import localeEs from '../lang/es_ES.json'
import localeFr from '../lang/fr_FR.json'
import localePt from '../lang/pt_PT.json'
import { IntlProvider } from 'react-intl'
import { flexGlobalSettings } from '../utils/constGlobals'
import axios from 'axios'

const langContext = React.createContext()

const API_AUTOCOMPLETE_URL = 'http://127.0.0.1:8000/api/translation/translations_by_application/1'


const LangProvider = ({ children }) => {
  let defaultLocale
  let defaultMessage
  
  let localeEn = {}
  let localeEs = {}

  const fetchLanguages = () =>{
    axios.post(API_AUTOCOMPLETE_URL).then((response)=>{
      console.log(response.data);
      localeEn = response.data.enEn
      localeEs = response.data.esEs
    })
  
  }
 // fetchLanguages()
  
  const lang = flexGlobalSettings.params.default_language || 'en'

  if (lang) {
    defaultLocale = 'en-EN'

    switch (lang) {
      case 'en':
        defaultMessage = localeEn
        defaultLocale = 'en-EN'
        break
      case 'es':
        defaultMessage = localeEs
        defaultLocale = 'es-ES'
        break
      case 'it':
        defaultMessage = localeIt
        defaultLocale = 'it-IT'
        break
      case 'pt':
        defaultMessage = localePt
        defaultLocale = 'pt-PT'
        break
      case 'fr':
        defaultMessage = localeFr
        defaultLocale = 'fr-FR'
        break
      default:
        defaultMessage = localeEn
        defaultLocale = 'en-EN'
        break
    }
  }

  const [messages, setMessages] = useState(defaultMessage)
  const [locale, setLocale] = useState(defaultLocale)

  const settingLanguage = lenguaje => {
    switch (lenguaje) {
      case 'en-EN':
        setMessages(localeEn)
        setLocale('en-EN')
        break
      case 'es-ES':
        setMessages(localeEs)
        setLocale('es-ES')
        break
      case 'en-US':
        setMessages(localeIt)
        setLocale('it-IT')
        break
      case 'fr-FR':
        setMessages(localeFr)
        setLocale('fr-FR')
        break
      case 'pt-PT':
        setMessages(localePt)
        setLocale('pt-PT')
        break
      default:
        setMessages(localeEn)
        setLocale('en-EN')
        break
    }
  }

  return (
    <langContext.Provider value={{ setLanguage: settingLanguage }}>
      <IntlProvider locale={locale} messages={messages}>
        {children}
      </IntlProvider>
    </langContext.Provider>
  )
}

export { LangProvider, langContext }
