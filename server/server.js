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
require('./models/Temparature');
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
const Temparature = mongoose.model('Temparature');
app.get('/uploaddata',(req, res, next) => {
  //const { payload: { id } } = req;

  return Temparature.find().limit(365)
    .then((temparature) => {
      if(!temparature) {
        return res.sendStatus(400);
      }

      return res.send(temparature);
    });
});

app.listen(3000, () => {
  console.log('Server started!');
});
