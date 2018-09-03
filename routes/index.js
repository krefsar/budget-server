const express = require('express');

const router = express.Router();
const users = require('./users');
const unallocateds = require('./unallocateds');
const expenses = require('./expenses');
const budgets = require('./budgets');
const transactions = require('./transactions');

router.get('/users/:id', users.findOne);
router.patch('/users/:id', users.updateOne);

router.get('/budgets/:id', budgets.findOne);
router.patch('/budgets/:id', budgets.updateOne);
router.delete('/budgets/:id', budgets.deleteOne);
router.post('/budgets', budgets.createOne);

router.post('/transactions', transactions.createOne);

router.get('/unallocateds/:id', unallocateds.findOne);
router.patch('/unallocateds/:id', unallocateds.updateOne);

router.get('/expenses', expenses.findAll);
router.get('/expenses/:id', expenses.findOne);
router.patch('/expenses/:id', expenses.updateOne);
router.delete('/expenses/:id', expenses.deleteOne);
router.post('/expenses', expenses.createOne);

module.exports = router;