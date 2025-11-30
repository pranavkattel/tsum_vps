import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import ScrollToTop from './components/ScrollToTop';
import BackgroundAudio from './components/BackgroundAudio';
import FloatingWhatsApp from './components/ui/FloatingWhatsApp';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <BackgroundAudio />
      <App />
      <FloatingWhatsApp phone="9779812345678" message="Hello! I want to inquire about a product." />
    </BrowserRouter>
  </StrictMode>
);
