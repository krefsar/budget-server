const { belongsTo, hasMany, FlintModel } = require('../lib/flintModeling');

const user = new FlintModel('user', {
  // unallocated: belongsTo('budget'),
  budgets: hasMany(),
  expenses: hasMany()
});

module.exports = user;