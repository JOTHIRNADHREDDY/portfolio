import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import App from './App.tsx';
import { ThemeProvider } from './utils/ThemeContext';
import { AuthProvider } from './utils/AuthContext';
import { DataStoreProvider } from './utils/DataStore';
import { ReactLenis } from 'lenis/react';
import 'lenis/dist/lenis.css';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <DataStoreProvider>
            <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothWheel: true }}>
              <App />
            </ReactLenis>
            <Analytics />
          </DataStoreProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);
