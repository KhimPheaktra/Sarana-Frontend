
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { SalesProvider } from './components/features/sales/SaleContext.tsx'
import './i18n/i18n';

createRoot(document.getElementById('root')!).render(
  <SalesProvider>
    <App />
  </SalesProvider>,
)
