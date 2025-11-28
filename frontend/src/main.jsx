import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ApolloProvider } from '@apollo/client/react';
import { apolloClient } from './apollo/client.js';
import { AuthProvider } from './auth/AuthProvider.jsx';
import App from './App.jsx'
import './styles/theme.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ApolloProvider client={apolloClient}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ApolloProvider>
  </StrictMode>,
)
