
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { SalesProvider } from './components/features/sales/SaleContext.tsx'

createRoot(document.getElementById('root')!).render(
  <SalesProvider>
    <App />
  </SalesProvider>,
)
