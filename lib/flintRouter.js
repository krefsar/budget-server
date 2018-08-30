const pluralize = require('pluralize');
const { createModel } = require('./flintModeling');

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

  get(urlPath) {
    const modelType = FlintRouter.getModelType(urlPath);
    const flintModel = createModel(modelType);

    this._router.get(urlPath, (req, res) => {
      const { id } = req.params;

      flintModel._BackingModel.where({ id })
        .fetch({ withRelated: 'budgets' })
        .then(fetchedModel => {
          console.log('fetched model', fetchedModel);
          res.status(200).send(fetchedModel);
        });
    })
  }

  setupRoutes(config) {
    config.call(this);
  }
}

module.exports = FlintRouter;