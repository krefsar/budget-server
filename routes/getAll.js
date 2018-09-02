const pluralize = require('pluralize');
const Mapper = require('jsonapi-mapper');
const mapper = new Mapper.Bookshelf();

module.exports = (req, res) => {
  const { modelType } = req.params;
  const { include } = req.query;

  const model = require(`../models/${pluralize.singular(modelType)}`);

  const fetchOptions = {};
  if (include) {
    fetchOptions.withRelated = include.split(',')
  }

  model
    .forge()
    .fetchAll(fetchOptions)
    .then(allModels => {
      res.status(200).send(mapper.map(allModels, modelType, { enableLinks: false }));
    });
}