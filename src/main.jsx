import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import "@fontsource/poppins";
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux';
import store from './Redux/Store.jsx'
import { SocketProvider } from './config/socket.jsx'
import { SuccessProvider } from './common/Toasts/SuccessProvider.jsx';
import { AlertProvider } from './common/Toasts/AlertProvider.jsx';
import { LoaderProvider } from './Component/Loader/useLoader.jsx';


ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Provider store={store}>
      <SocketProvider>
        <SuccessProvider>
          <AlertProvider>
            <LoaderProvider>
              <App />
            </LoaderProvider>
          </AlertProvider>
        </SuccessProvider>
      </SocketProvider>
    </Provider>
  </BrowserRouter>
)
