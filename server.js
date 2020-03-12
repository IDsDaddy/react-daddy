const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

require('./models/Product');
const app = express();
// const db = 'mongodb+srv://daddy:daddy123@testcluster-je0ea.gcp.mongodb.net/test';
const db = 'mongodb+srv://daddy:daddy123@testcluster-je0ea.gcp.mongodb.net/test';

// mongoose.Promise = global.Promise;
// mongoose.connect(process.env.MONGODB_URI || `mongodb://localhost:27017/daddyspageexpress`);

//Bodyparse midware
app.use(bodyParser.json());
mongoose.connect(db)
  .then(()=>console.log('connection established...'))
  .catch(e=>console.log(e));
require('./routes/productRoutes')(app);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));

  const path = require('path');
  app.get('*', (req,res) => {
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })

}
app.get('/', (req, res) => res.send('Hello world!'));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`app running on port ${PORT}`)
});