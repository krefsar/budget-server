const Mapper = require('jsonapi-mapper');
const budgetModel = require('../models/budget');

const budgetModule = (function() {
  const mapper = new Mapper.Bookshelf();
  
  const findOne = (req, res) => {
    const { id } = req.params;
    const { include } = req.query;

    budgetModel
      .forge({ id })
      .fetch({
        withRelated: include.split(',')
      })
      .then(fetchedModel => {
        const formatted = mapper.map(fetchedModel, 'budgets', { enableLinks: false });

        res.status(200).send(formatted);
      });
  };

  const updateOne = (req, res) => {
    const { id } = req.params;
    const { data: { attributes, relationships } } = req.body;

    budgetModel
      .forge({ id })
      .save({ ...attributes })
      .then(updatedModel => {
        let transactionIds;
        if (relationships && relationships.transactions) {
          const { data } = relationships.transactions;

          transactionIds = data.map(datum => datum.id);
        }

        return Promise.all([
          updatedModel,
          updatedModel.transactions().attach(transactionIds)
        ]);
      })
      .then(([updatedModel]) => {
        const formatted = mapper.map(updatedModel, 'budgets', { enableLinks: false });

        res.status(200).send(formatted);
      });
  }

  const createOne = (req, res) => {
    const { data: { attributes, relationships } } = req.body;

    const { user } = relationships;

    budgetModel
      .forge()
      .save({ ...attributes, user_id: user.data.id })
      .then(newModel => {
        const formatted = mapper.map(newModel, 'budgets', { enableLinks: false });

        res.status(201).send(formatted);
      });
  }

  const deleteOne = (req, res) => {
    const { id } = req.params;

    budgetModel
      .forge({ id })
      .destroy()
      .then(() => {
        res.status(204).send({});
      });
  }

  return {
    findOne,
    updateOne,
    createOne,
    deleteOne
  }
})();

module.exports = budgetModule;