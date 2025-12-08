import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { MetricProvider } from './context/MetricContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <MetricProvider>
                <App />
            </MetricProvider>
        </BrowserRouter>
    </React.StrictMode>,
)
