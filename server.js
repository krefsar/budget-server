const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

app.use('/api', require('./routes'));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('server started on port', port);
});