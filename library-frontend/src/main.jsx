import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './style.scss'
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import { NotificationContextProvider } from './contexts/NotificationContext.jsx'

const client = new ApolloClient({
  uri: 'http://localhost:4000',
  cache: new InMemoryCache(),
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <ApolloProvider client={client}>
    <NotificationContextProvider>
      <App />
    </NotificationContextProvider>
  </ApolloProvider>
)
