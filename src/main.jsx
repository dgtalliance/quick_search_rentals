import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { Provider } from 'react-redux'
import { store } from './store'

import './context/i18n'


import * as Sentry from '@sentry/react'
import { BrowserTracing } from '@sentry/tracing'
import { Suspense } from 'react'
import Loading from './components/Loading'

 Sentry.init({  
  dsn: "https://f3b3aa5b0f6548d191fd7bb7972bbcf6@o176772.ingest.sentry.io/4504282707066880",
  integrations: [new BrowserTracing()],
  tracesSampleRate: 1.0,
});
 


ReactDOM.createRoot(
  document.getElementById('ib-wrapper-quick-search-rentals')
).render(
  <Provider store={store}>
    <Suspense fallback={<Loading/>}>
    <App />
    </Suspense>
  </Provider>
)
