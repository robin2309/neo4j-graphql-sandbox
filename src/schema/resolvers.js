const resolvers = {
  Query: {
      movies: async (_, __, ctx) => {
        const session = ctx.executionContext.session();
        const result = await session.run('MATCH (m:Movie) RETURN m');
        await session.close();

        return result.records.map(record => record.get('m').properties);
      },
      actors: async (_, __, ctx) => {
        const session = ctx.executionContext.session();
        const result = await session.run('MATCH (a:Actor) RETURN a');
        await session.close();

        return result.records.map(record => record.get('a').properties);
      },
      findMovieByTitle: async (_parent, { title }, ctx, _resolveInfo) => {
        const session = ctx.executionContext.session();
        try {
          const result = await session.run('MATCH (m:Movie {title: $title}) RETURN m', {
            title,
          });

          if (result.records.length > 0) {
            return result.records[0].get('m').properties;
          } else {
            return null;
          }
        } finally {
          session.close();
        }
      },
  },
  Mutation: {
    createMovieAndRelateToActor: async (_parent, { title, actorName }, ctx, _resolveInfo) => {
      const session = ctx.executionContext.session();
      try {
        await session.writeTransaction(async (transaction) => {
        // Create the Movie node with the provided title
        const createMovieResult = await transaction.run(
          'CREATE (m:Movie {title: $title}) RETURN m',
          { title }
        );

        // Find the Actor node with the provided name
        const findActorResult = await transaction.run(
          'MATCH (a:Actor {name: $actorName}) RETURN a',
          { actorName }
        );

        console.log(findActorResult);

        // Relate the Movie node to the Actor node
        if (findActorResult.records.length > 0) {
          const actorNode = findActorResult.records[0].get('a');
          const movieNode = createMovieResult.records[0].get('m');

          await transaction.run(
            'MATCH (a:Actor), (m:Movie) WHERE id(a) = $actorId AND id(m) = $movieId CREATE (a)-[:ACTED_IN]->(m)',
            { actorId: actorNode.identity, movieId: movieNode.identity }
          );
        }

        // Return the newly created Movie node
        return { title };
      });
      } finally {
        session.close();
      }
    },
  },
};

module.exports = resolvers;
