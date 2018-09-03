const pluralize = require('pluralize');
const Mapper = require('jsonapi-mapper');
const mapper = new Mapper.Bookshelf();

module.exports = (req, res) => {
  const { modelType, id } = req.params;
  const { include } = req.query;

  const model = require(`../models/${pluralize.singular(modelType)}`);

  const fetchOptions = {}

  if (include) {
    fetchOptions.withRelated = include.split(',');
  }

  model
    .forge({ id })
    .fetch(fetchOptions)
    .then(fetchedModel => {
      res.status(200).send(mapper.map(fetchedModel, modelType, { enableLinks: false }));
    });
}
