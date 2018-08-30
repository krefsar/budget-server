const pluralize = require('pluralize');
const { getFlintModel } = require('./flintModeling');
const Mapper = require('jsonapi-mapper');
const mapper = new Mapper.Bookshelf();

class FlintRouter {
  constructor(router) {
    this._router = router;
  }

  static getModelType(urlPath) {
    return pluralize.singular(urlPath.split('/')[1]);
  }

  getRouter() {
    return this._router;
  }

  post(urlPath) {
    const modelType = FlintRouter.getModelType(urlPath);
    const flintModel = getFlintModel(modelType);

    this._router.post(urlPath, (req, res) => {
      const { data: { attributes } } = req.body;
      
      let query = new flintModel._BackingModel({
        ...attributes
      });

      query.save()
        .then(savedModel => {
          res.status(201).send(mapper.map(savedModel, modelType));
        });
    });
  }

  delete(urlPath) {
    const modelType = FlintRouter.getModelType(urlPath);
    const flintModel = getFlintModel(modelType);

    this._router.delete(urlPath, (req, res) => {
      const { id } = req.params;

      let query = new flintModel._BackingModel({
        id
      });

      query.destroy()
        .then(() => {
          res.status(204).send({});
        });
    });
  }

  patch(urlPath) {
    const modelType = FlintRouter.getModelType(urlPath);
    const flintModel = getFlintModel(modelType);

    this._router.patch(urlPath, (req, res) => {
      const { id } = req.params;

      const { data: { attributes, relationships } } = req.body;

      let query = new flintModel._BackingModel({ id });
      query.save(attributes, { patch: true })
        .then(updatedModel => {
          res.status(200).send(mapper.map(updatedModel, modelType));
        });
    });
  }

  get(urlPath) {
    const modelType = FlintRouter.getModelType(urlPath);
    const flintModel = getFlintModel(modelType);

    this._router.get(urlPath, (req, res) => {
      const { id } = req.params;
      const { include } = req.query;

      let query = flintModel._BackingModel;

      const fetchOptions = {};

      if (include) {
        fetchOptions.withRelated = include.split(',');
      }

      if (id) {
        query = query.where({ id }).fetch(fetchOptions);
      } else {
        query = query.fetchAll(fetchOptions)
      }

      query
        .then(fetchedModel => {
          res.status(200).send(mapper.map(fetchedModel, modelType));
        });
    });

    // also create gets for relationships
    console.log('model', modelType, 'has relationships', flintModel._relations);
    flintModel._relations.forEach(relation => {
      this._router.get(`${urlPath}/${relation}`, (req, res) => {
        const { id } = req.params;
        console.log(`get ${relation} for ${modelType} ${id}`)
        let query = flintModel._BackingModel.where({ id });

        query.fetch({
          withRelated: [relation]
        })
          .then(fetchedModel => {
            return mapper.map(fetchedModel.relations[relation], pluralize.singular(relation));
          });
      });
    });
  }

  setupRoutes(config) {
    config.call(this);
  }
}

module.exports = FlintRouter;