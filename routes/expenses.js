const Mapper = require('jsonapi-mapper');
const expenseModel = require('../models/expense');

const expenseModule = (function() {
  const mapper = new Mapper.Bookshelf();

  const findAll = (req, res) => {
    const { include = ''} = req.query;

    expenseModel
      .forge()
      .fetchAll({
        withRelated: include.split(',')
      })
      .then(allModels => {
        const formatted = mapper.map(fetchedModel, 'expenses', { enableLinks: false });
        res.status(200).send(formatted);
      });
  }

  const findOne = (req, res) => {
    const { id } = req.params;
    const { include } = req.query;

    expenseModel
      .forge({ id })
      .fetch({
        withRelated: include.split(',')
      })
      .then(fetchedModel => {
        const formatted = mapper.map(fetchedModel, 'expenses', { enableLinks: false });

        res.status(200).send(formatted);
      });
  }

  const updateOne = (req, res) => {
    const { id } = req.params;
    const { data: { attributes, relationships } } = req.body;

    expenseModel
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
        const formatted = mapper.map(updatedModel, 'expenses', { enableLinks: false });

        res.status(200).send(formatted);
      });
  }

  const deleteOne = (req, res) => {
    const { id } = req.params;

    expenseModel
      .forge({ id })
      .destroy()
      .then(() => {
        res.status(204).send({});
      });
  }

  const createOne = (req, res) => {
    const { data: { attributes, relationships } } = req.body;

    const { user } = relationships;

    expenseModel
      .forge()
      .save({ ...attributes, user_id: user.data.id })
      .then(newModel => {
        const formatted = mapper.map(newModel, 'expenses', { enableLinks: false });

        res.status(201).send(formatted);
      });
  }

  return {
    findAll,
    findOne,
    updateOne,
    deleteOne,
    createOne
  };
})();

module.exports = expenseModule;