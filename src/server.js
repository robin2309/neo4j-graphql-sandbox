const { ApolloServer } = require('apollo-server');
const { Neo4jGraphQL } = require('@neo4j/graphql');
const typeDefs = require('./schema/typeDefs');
const resolvers = require('./schema/resolvers');
const driver = require('./db/neo4jDriver');

// const schema = makeExecutableSchema({
//     typeDefs,
//     resolvers,
// });

const neoSchema = new Neo4jGraphQL({ typeDefs, driver, resolvers });

const startServer = async () => {
  const schema = await neoSchema.getSchema();
  const server = new ApolloServer({ schema });

  server.listen(process.env.API_PORT).then(({ url }) => {
      console.log(`🚀🚀 GraphQL API ready at ${url}`);
  });
};

startServer();
