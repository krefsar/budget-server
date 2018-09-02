const bookshelf = require('../lib/bookshelf');
const transaction = require('./transaction');

const budget = bookshelf.Model.extend({
  tableName: 'budgets',

  transactions: function() {
    return this.belongsToMany(transaction);
  }
});

module.exports = budget;