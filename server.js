/** @format */
const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const cors = require('cors');
const dotEnv = require('dotenv');

const resolvers = require('./resolvers');
const typeDefs = require('./typeDefs');
// set env variables
dotEnv.config();

async function startApolloServer(typeDefs, resolvers) {
  const apolloServer = new ApolloServer({ typeDefs, resolvers });
  await apolloServer.start();

  const app = express();
  app.use(cors());

  app.use(express.json());

  apolloServer.applyMiddleware({ app, path: '/graphql' });

  const port = process.env.PORT || 5000;

  app.use('/', (req, res, next) => {
    res.send('hello hi');
  });

  await new Promise((resolve) =>
    app.listen(port, () => {
      console.log(`Server listening on port: ${port}`);
      console.log(`GraphQL endpoint: ${apolloServer.graphqlPath}`);
    })
  );
}

startApolloServer(typeDefs, resolvers);
