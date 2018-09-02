const bookshelf = require('../lib/bookshelf');
const budget = require('./budget');
const expense = require('./expense');

const user = bookshelf.Model.extend({
  tableName: 'users',

  unallocated: function() {
    return this.hasOne(budget);
  },

  budgets: function() {
    return this.hasMany(budget);
  },

  expenses: function() {
    return this.hasMany(expense);
  }
});

module.exports = user;
