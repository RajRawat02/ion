const IncomingForm = require('formidable').IncomingForm;
const fs = require('fs');
const JSONStream = require('JSONStream');
const mongoose = require('mongoose');
require('./models/User');
const User = mongoose.model('User');
module.exports = function upload(req, res) {
  const form = new IncomingForm();

  form.on('file', (field, file) => {
    // Do something with the file
    // e.g. save it to the database
    // you can access it using file.path
    console.log('file', file.name);
    const readStream = fs.createReadStream(file.path);
    readStream.pipe(JSONStream.parse('*')).on('data', async (userData) => {
      //arrayOfUsers.push(userData);
      //if (arrayOfUsers.length === 1000000) {
        readStream.pause();
        await User.create(userData);
        //arrayOfUsers = [];
        //process.stdout.write('.');
        readStream.resume();
     // }
    });
    // readStream.on('end', async () => {
    //   //await User.create(arrayOfUsers); // left over data
    //   console.log('\nImport complete, closing connection...');
    //   //db.close();
    //   process.exit(0);
    // });
  });
  form.on('end', () => {
    res.json();
  });
  form.parse(req);
};
