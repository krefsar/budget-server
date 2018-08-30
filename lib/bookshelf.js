const dbSettings = require('../config/settings').db;

const knex = require('knex')({
  client: 'mysql',
  connection: {
    host: dbSettings.host,
    user: dbSettings.user,
    password: dbSettings.password,
    database: dbSettings.database,
    charset: 'utf8'
  }
});

const bookshelf = require('bookshelf')(knex);

module.exports = bookshelf;