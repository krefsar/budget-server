const { hasMany, FlintModel } = require('../lib/flintModeling');

const expense = new FlintModel('expense', {
  transactions: hasMany('transaction', {
    joinTable: true
  })
});

module.exports = expense;