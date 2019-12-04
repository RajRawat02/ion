const express = require('express');
const upload = require('./upload');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');
//const errorHandler = require('errorhandler');
//const server = express();
const app = express();
mongoose.connect('mongodb://localhost/file-upload');
mongoose.set('debug', true);

//Models & routes
require('./models/User');
//Configure our app
app.use(cors());
//app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'passport-tutorial', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));
var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.post('/upload', upload);
const User = mongoose.model('User');
app.get('/uploaddata',(req, res, next) => {
  //const { payload: { id } } = req;

  return User.find().limit(100)
    .then((user) => {
      if(!user) {
        return res.sendStatus(400);
      }

      return res.send(user);
    });
});

app.listen(3000, () => {
  console.log('Server started!');
});
