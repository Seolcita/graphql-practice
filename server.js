/** @format */
const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const cors = require('cors');
const dotEnv = require('dotenv');
const { tasks, users } = require('./constants');

// set env variables
dotEnv.config();

const typeDefs = gql`
  type Query {
    greetings: String
    tasks: [Task!]
  }

  type User {
    id: ID!
    name: String!
    email: String!
    tasks: [Task!]
  }

  type Task {
    id: ID!
    name: String!
    completed: Boolean!
    user: User!
  }
`;

const resolvers = {
  Query: { greetings: () => 'hello', tasks: () => tasks },
  Task: {
    // parent >> each task >> ex) { id: '1', name: 'Work', completed: false, userId: '3' },
    user: parent => users.find(user => user.id === parent.userId),
  },
};

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

  await new Promise(resolve =>
    app.listen(port, () => {
      console.log(`Server listening on port: ${port}`);
      console.log(`GraphQL endpoint: ${apolloServer.graphqlPath}`);
    })
  );
}

startApolloServer(typeDefs, resolvers);
