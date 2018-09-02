const bookshelf = require('../lib/bookshelf');

const transaction = bookshelf.Model.extend({
  tableName: 'transactions'
});

module.exports = transaction;
