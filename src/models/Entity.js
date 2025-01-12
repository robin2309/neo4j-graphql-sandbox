const neo4j = require('neo4j-driver');
require('dotenv').config();

const driver = neo4j.driver(
  process.env.NEO4J_URI || 'bolt://neo4j:7687',
  neo4j.auth.basic(
    process.env.NEO4J_USER || 'neo4j',
    process.env.NEO4J_PASSWORD || 'test12345'
  )
);

const session = driver.session();

const createEntity = async (name, type) => {
  const result = await session.run(
    'CREATE (e:Entity {name: $name, type: $type}) RETURN e',
    { name, type }
  );
  return result.records[0].get('e');
};

const getEntities = async () => {
  const result = await session.run('MATCH (e:Entity) RETURN e');
  return result.records.map(record => record.get('e').properties);
};

module.exports = { createEntity, getEntities };
