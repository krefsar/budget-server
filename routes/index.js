const express = require('express');
const config = require('./config');
const FlintRouter = require('../lib/flintRouter')

const router = express.Router();
const flintRouter = new FlintRouter(router);

flintRouter.setupRoutes(config);

module.exports = flintRouter.getRouter();