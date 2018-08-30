const bookshelf = require('./bookshelf');
const pluralize = require('pluralize');

class FlintModel {
  constructor(modelType, config = {}) {
    this._modelType = modelType;
    this._relations = Object.keys(config);

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

function belongsTo() {
  return function(modelType) {
    return function() {
      const Model = require(`../models/${modelType}`);
      return this.belongsTo(Model._BackingModel);
    };
  };
}

function hasMany(modelName, options = {}) {
  return function(modelType) {
    return function() {
      const Model = require(`../models/${modelType}`);
      if (options.joinTable) {
        return this.belongsToMany(Model._BackingModel);
      } else {
        return this.hasMany(Model._BackingModel);
      }
    };
  };
}

function getFlintModel(modelType) {
  return require(`../models/${modelType}`);
}

module.exports = {
  belongsTo,
  getFlintModel,
  hasMany,
  FlintModel
}