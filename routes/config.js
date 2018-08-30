module.exports = function() {
  this.get('/users/:id');
  // this.patch('/users/:id');

  this.get('/budgets');
  this.get('/budgets/:id');
  // this.patch('/budgets/:id');
  // this.delete('/budgets/:id');
  // this.post('/budgets');

  this.get('/transactions');
  // this.post('/transactions');

  this.get('/expenses');
  this.get('/expenses/:id');
  // this.patch('/expenses/:id');
  // this.delete('/expenses/:id');
  // this.post('/expenses');
}