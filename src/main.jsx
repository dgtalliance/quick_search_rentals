import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { Provider } from 'react-redux'
import { store } from './store'

import './context/i18n'


import * as Sentry from '@sentry/react'
import { BrowserTracing } from '@sentry/tracing'

 Sentry.init({
  dsn: "https://321bd1acb87940a49068ee8e7533d020@o176772.ingest.sentry.io/6396526",
  integrations: [new BrowserTracing()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});
 


ReactDOM.createRoot(
  document.getElementById('ib-wrapper-quick-search-rentals')
).render(
  <Provider store={store}>
    <App />
  </Provider>
)
