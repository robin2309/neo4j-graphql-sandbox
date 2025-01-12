const typeDefs = `#graphql
    type Movie @node {
        title: String
        actors: [Actor!]! @relationship(type: "ACTED_IN", direction: IN)
    }

    type Actor @node {
        name: String
        movies: [Movie!]! @relationship(type: "ACTED_IN", direction: OUT)
    }

    type Query {
      findMovieByTitle(title: String!): Movie
    }
    
    type Mutation {
      createMovieAndRelateToActor(title: String!, actorName: String!): Movie
    }
`;

module.exports = typeDefs;
