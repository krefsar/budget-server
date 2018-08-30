const bookshelf = require('./bookshelf');
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
      return this.hasMany(Model._BackingModel);
    }
  }
}

function createModel(modelType) {
  return require(`../models/${modelType}`);
}

module.exports = {
  createModel,
  hasMany,
  FlintModel
}