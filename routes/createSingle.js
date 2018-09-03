const pluralize = require('pluralize');
const Mapper = require('jsonapi-mapper');
const mapper = new Mapper.Bookshelf();

module.exports = (req, res) => {
  const { modelType } = req.params;
  const { data: { attributes, relationships } } = req.body;
  console.log(attributes, relationships);

  const model = require(`../models/${pluralize.singular(modelType)}`);

  model
    .forge({ ...attributes })
    .save()
    .then(newModel => {
      res.status(201).send(mapper.map(newModel, modelType, { enableLinks: false }));
    });
}