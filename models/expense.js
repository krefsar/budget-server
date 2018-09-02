const bookshelf = require('../lib/bookshelf');
const transaction = require('./transaction');

const expense = bookshelf.Model.extend({
  tableName: 'expenses',

  transactions: function() {
    return this.belongsToMany(transaction);
  }
});

module.exports = expense;