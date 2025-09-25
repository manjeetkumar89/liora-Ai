import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store/store.js'
import App from './App.jsx'
import {registerSW} from 'virtual:pwa-register'
import { ToastContainer } from 'react-toastify'

registerSW();

createRoot(document.getElementById('root')).render(

    <Provider store={store}>
      <App />
      <ToastContainer />
    </Provider>
  
)
