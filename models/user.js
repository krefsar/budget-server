const { hasMany, FlintModel } = require('../lib/flintModeling');

const User = new FlintModel('user', {
  budgets: hasMany()
});

module.exports = User;