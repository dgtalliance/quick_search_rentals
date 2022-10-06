import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { Provider } from 'react-redux'
import { store } from './store'

import './context/i18n'

ReactDOM.createRoot(
  document.getElementById('ib-wrapper-quick-search-rentals')
).render(
  <Provider store={store}>
    <App />
  </Provider>
)
