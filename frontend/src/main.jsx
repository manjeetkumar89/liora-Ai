import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store/store.js'
import App from './App.jsx'
import {registerSW} from 'virtual:pwa-register'
import { ToastContainer } from 'react-toastify'
import HealthCheckWrapper from './components/HealthCheckWrapper.jsx'

registerSW();

createRoot(document.getElementById('root')).render(

    <Provider store={store}>
      <HealthCheckWrapper />
      <ToastContainer />
    </Provider>
)
