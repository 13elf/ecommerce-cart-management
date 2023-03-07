const express = require('express');
const cors = require('cors');
const helmet = require('helmet')
const { json } = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.use(json()); // enable json body parsing

// add the cors headers to allow requests to the api from cetain domains
const trustedOrigins = ['localhost'];
app.use(cors({
  origin: trustedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
}))

// add security headers to every response
app.use(helmet());

// import routes
const user = require('./routes/user');
const product = require('./routes/product');

app.use('/user', user);
app.use('/product', product);

// generic error handler
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode;
  delete error.statusCode;
  res.status(status || 500).json(error);
})

mongoose.connect(process.env.MONGO_DB_URI)
  .then(() => {
    app.listen(8000);
  })
  .catch(error => {
    console.log(error);
  });

