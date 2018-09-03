const Mapper = require('jsonapi-mapper');
const userModel = require('../models/user');

const userModule = (function() {
  const mapper = new Mapper.Bookshelf();

  const findOne = (req, res) => {
    const { id } = req.params;
    const { include } = req.query;

    userModel
      .forge({ id })
      .fetch({
        withRelated: include.split(',')
      })
      .then(fetchedModel => {
        const formatted = mapper.map(fetchedModel, 'users', { enableLinks: false });

        res.status(200).send(formatted);
      });
  };

  const updateOne = () => {};

  return {
    findOne,
    updateOne
  }
})();

module.exports = userModule;