import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-client-preset';
import { ApolloProvider } from 'react-apollo';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql',
  }),
  cache: new InMemoryCache()
});

ReactDOM.render(
  (<ApolloProvider client={client}>
    <App />
  </ApolloProvider>),
  document.getElementById('root'));
registerServiceWorker();
