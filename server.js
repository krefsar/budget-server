const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(cors());

app.use('/api', require('./routes'));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('server started on port', port);
});