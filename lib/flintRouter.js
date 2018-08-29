class FlintRouter {
  constructor(router) {
    this._router = router;
  }

  static getModelType(urlPath) {
    return urlPath.split('/')[1];
  }

  getRouter() {
    return this._router;
  }

  get(urlPath) {
    const modelType = FlintRouter.getModelType(urlPath);

    this._router.get(urlPath, (req, res) => {
      res.status(200).send({
        message: `trying to grab ${modelType} ${req.params.id}`
      });
    })
  }

  setupRoutes(config) {
    config.call(this);
  }
}

module.exports = FlintRouter;