const Mapper = require('jsonapi-mapper');
const userModel = require('../models/user');
const budgetModel = require('../models/budget');

const userModule = (function() {
  const mapper = new Mapper.Bookshelf();

  const findOne = (req, res) => {
    const { id } = req.params;
    const { include } = req.query;

    const fetchOptions = {};
    if (include) {
      fetchOptions.withRelated = include.split(',');
    }

    userModel
      .forge({ id })
      .fetch(fetchOptions)
      .then(fetchedModel => {
        const formatted = mapper.map(fetchedModel, 'users', { enableLinks: false });

        res.status(200).send(formatted);
      });
  };

  const updateOne = (req, res) => {
    const { id } = req.params;
    const { data: { attributes } } = req.body;

    userModel
      .forge({ id })
      .save({ ...attributes })
      .then(updatedModel => {
        const formatted = mapper.map(updatedModel, 'users', { enableLinks: false });

        res.status(200).send(formatted);
      });
  };

  return {
    findOne,
    updateOne
  }
})();

module.exports = userModule;