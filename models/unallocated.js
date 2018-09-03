const bookshelf = require('../lib/bookshelf');
const transaction = require('./transaction');

const unallocated = bookshelf.Model.extend({
  tableName: 'unallocateds',

  transactions: function() {
    return this.belongsToMany(transaction);
  }
});

module.exports = unallocated;