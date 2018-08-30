const bookshelf = require('../config/bookshelf');

const { FlintModel } = require('../lib/flintModeling');

const Budget = new FlintModel('budget', {
});

module.exports = Budget;