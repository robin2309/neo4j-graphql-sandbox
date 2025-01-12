const EntityModel = ogm.model('Entity');

// Example: Create an entity
(async () => {
  await EntityModel.create({
    input: [
      { id: '1', name: 'LOTR 1', type: 'Fantastic' },
      { id: '2', name: 'LOTR 2', type: 'Fantastic' },
    ],
  });
})();

// Example: Query entities
(async () => {
  const entities = await EntityModel.find({
    where: { type: 'Fantastic' },
  });
  console.log(entities);
})();