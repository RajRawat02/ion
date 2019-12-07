const IncomingForm = require('formidable').IncomingForm;
const fs = require('fs');
const JSONStream = require('JSONStream');
const mongoose = require('mongoose');
require('./models/Temparature');
const Temparature = mongoose.model('Temparature');
module.exports = function upload(req, res) {
  const form = new IncomingForm();

  form.on('file', (field, file) => {
    // Do something with the file
    // e.g. save it to the database
    // you can access it using file.path
    console.log('file', file.name);
    const readStream = fs.createReadStream(file.path);
    readStream.pipe(JSONStream.parse('*')).on('data', async (temparatureData) => {
        readStream.pause();
        await Temparature.create(temparatureData);
        readStream.resume();
    });
  });
  form.on('end', () => {
    res.json();
  });
  form.parse(req);
};
