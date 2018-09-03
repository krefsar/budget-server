const bookshelf = require('../lib/bookshelf');
const budget = require('./budget');
const expense = require('./expense');

const transaction = bookshelf.Model.extend({
  tableName: 'transactions',

  budget: function() {
    return this.belongsTo(budget);
  },

  expense: function() {
    return this.belongsTo(expense);
  }
});

module.exports = transaction;
