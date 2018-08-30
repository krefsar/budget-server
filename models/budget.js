const { FlintModel, hasMany } = require('../lib/flintModeling');

const budget = new FlintModel('budget', {
  transactions: hasMany('transaction', {
    joinTable: true
  })
});

module.exports = budget;