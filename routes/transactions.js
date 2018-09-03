const Mapper = require('jsonapi-mapper');
const transactionModel = require('../models/transaction');

const transactionModule = (function() {
  const mapper = new Mapper.Bookshelf();

  const createOne = (req, res) => {
    const { data: { attributes } } = req.body;

    transactionModel
      .forge()
      .save({ ...attributes })
      .then(newModel => {
        const formatted = mapper.map(newModel, 'transactions', { enableLinks: false });

        res.status(201).send(formatted);
      });
  };

  return {
    createOne
  }

})();

module.exports = transactionModule;