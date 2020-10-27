/**
 * HTTP Cloud Function.
 * This function is exported by index.js, and is executed when
 * you make an HTTP request to the deployed function's endpoint.
 *
 * @param {Object} req Cloud Function request context.
 *                     More info: https://expressjs.com/en/api.html#req
 * @param {Object} res Cloud Function response context.
 *                     More info: https://expressjs.com/en/api.html#res
 */

let express = require('express');
let app = express();

app.get('/', (req,res) => {
  res.status(200).send('Hello GET!');
});
app.post('/', (req,res) => {
  res.status(200).send('Hello POST!');
});
app.put('/', (req,res) => {
  res.status(200).send('Hello PUT!');
});
app.delete('/', (req,res) => {
  res.status(200).send('Hello DELETE!');
});

exports.helloGET = app;