const bookshelf = require('../config/bookshelf');
const capitalize = require('./capitalize');
const pluralize = require('pluralize');

class FlintModel {
  constructor(modelType, config = {}) {
    this._modelType = modelType;

    const BackingModel = bookshelf.Model.extend({
      tableName: pluralize(modelType),
      ...generateRelationshipConfig(config)
    });

    this._BackingModel = BackingModel;
  }
}

function generateRelationshipConfig(config) {
  return Object.keys(config).reduce((mp, configKey) => {
    const relationshipFn = config[configKey];

    return {
      ...mp,
      [configKey]: relationshipFn(pluralize.singular(configKey))
    };
  }, {});
}

function hasMany() {
  return function(modelType) {
    return function() {
      const Model = require(`../models/${modelType}`);
      console.log('going to have many', Model);
      return this.hasMany(Model);
    }
  }
}

function createModel(modelType) {
  console.log('creating model for ', modelType);
  const Model = require(`../models/${modelType}`);

  return Model;
}

module.exports = {
  createModel,
  hasMany,
  FlintModel
}