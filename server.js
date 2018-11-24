require('dotenv').config()
const bodyParser = require('body-parser');
const createJWT = require('jsonwebtoken');
const cors = require('cors');
const express = require('express');
const request = require('request');
const validateJWT = require('express-jwt');

const Mapper = require('jsonapi-mapper');
const unallocatedModel = require('./models/unallocated');
const userModel = require('./models/user');

const app = express();

app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(cors());

app.post('/get-token', bodyParser.urlencoded(), (req, res) => {
  const accessToken = req.body.password;

  request(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${accessToken}`, function(err, response, body) {
    const { email } = JSON.parse(body);
    userModel
      .forge({ email })
      .fetch()
      .then(fetchedModel => {
        if (!fetchedModel) {
          return createNewUser({ email });
        }

        return { id: fetchedModel.id };
      })
      .then(({ id }) => {
        sendToken(res, id);
      });
  });
});

const createNewUnallocated = async (userId) => {
  return unallocatedModel.forge({ balance: 0, user_id: userId }).save(null, { method: 'insert' });
};

const createNewUser = async ({ email }) => {
  const newUser = await userModel.forge({ email }).save(null, { method: 'insert' });

  await createNewUnallocated(newUser.id);
  return newUser;
};

app.post('/refresh-token', bodyParser.json(), function(req, res) {
  var oldToken = req.body.access_token;

  createJWT.verify(oldToken, process.env.SERVER_SECRET, function (err, decodedToken) {
    if (!err) {
      sendToken(res, decodedToken.userId);
    } else {
      res.send({});
    }
  });
});

const sendToken = (res, userId) => {
    var token = createJWT.sign(
      { userId },
      process.env.SERVER_SECRET,
      { expiresIn: 2400 }
    );

    res.send({ access_token: token, expires_in: 2400 });
};

app.get('/current-user', validateJWT({ secret: process.env.SERVER_SECRET }), (req, res) => {
  const { userId } = req.user;
  const mapper = new Mapper.Bookshelf();

  userModel
    .forge({ id: userId })
    .fetch({ withRelated: ['unallocated', 'budgets', 'expenses'] })
    .then(fetchedModel => {
      const formatted = mapper.map(fetchedModel, 'users', { enableLinks: false });

      res.status(200).send(formatted);
    });
});

app.use('/api', validateJWT({ secret: process.env.SERVER_SECRET }), require('./routes'));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('server started on port', port);
});