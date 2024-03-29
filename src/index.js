import './index.css';
import App from './App';
import React from 'react';
import '../src/font/font.css';
import { RecoilRoot } from 'recoil';
import { BrowserRouter } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
// import Modals from '../src/components/ui/modal/modals';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <RecoilRoot>
    <BrowserRouter>
      <ToastContainer />
      <App />
    </BrowserRouter>
  </RecoilRoot>,
  // </React.StrictMode>
);

reportWebVitals();
