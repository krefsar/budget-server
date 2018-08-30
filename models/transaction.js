const { belongsTo, hasMany, FlintModel } = require('../lib/flintModeling');

const transaction = new FlintModel('transaction', {
  budget: belongsTo(),
  expenses: hasMany()
});

module.exports = transaction;