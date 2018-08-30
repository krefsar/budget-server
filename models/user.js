const { hasMany, FlintModel } = require('../lib/flintModeling');

const user = new FlintModel('user', {
  budgets: hasMany()
});

module.exports = user;