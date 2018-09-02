const express = require('express');

const router = express.Router();

router.get('/:modelType', require('./getAll'));
router.get('/:modelType/:id', require('./getSingle'));

router.delete('/:modelType/:id', require('./deleteSingle'));

router.post('/:modelType', require('./createSingle'));

router.patch('/:modelType/:id', require('./updateSingle'));

module.exports = router;