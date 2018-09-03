const Mapper = require('jsonapi-mapper');
const unallocatedModel = require('../models/unallocated');

const unallocatedModule = (function() {
  const mapper = new Mapper.Bookshelf();

  const findOne = (req, res) => {
    const { id } = req.params;
    const { include = '' } = req.query;

    unallocatedModel
      .forge({ id })
      .fetch({
        withRelated: include.split(',')
      })
      .then(fetchedModel => {
        const formatted = mapper.map(fetchedModel, 'unallocateds', { enableLinks: false });

        res.status(200).send(formatted);
      });
  };

  const updateOne = (req, res) => {
    const { id } = req.params;
    const { data: { attributes, relationships } } = req.body;

    unallocatedModel
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
        const formatted = mapper.map(updatedModel, 'unallocateds', { enableLinks: false });

        res.status(200).send(formatted);
      });
  };

  return {
    findOne,
    updateOne
  }
})();

module.exports = unallocatedModule;