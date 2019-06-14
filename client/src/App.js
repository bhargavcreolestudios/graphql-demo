import React from 'react';
import './App.css';
import Structure from './layout/Structure'
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

const client = new ApolloClient({
  uri: 'http://localhost:5000/graphql'
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Structure />
    </ApolloProvider>
  );
}

export default App;
