const pluralize = require('pluralize');

module.exports = (req, res) => {
  const { modelType, id } = req.params;

  const model = require(`../models/${pluralize.singular(modelType)}`);

  model
    .forge({ id })
    .destroy()
    .then(() => {
      res.status(204).send({});
    });
}