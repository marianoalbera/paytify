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

//var dateFormat = require('dateformat');
//var now = new Date();
//var exp = new Date();
//exp.setHours(exp.getHours()+1);


//I need to validate token in header

//and I route through the different functions
app.post('/cards/tokenize', (req,res) => {
  res.setHeader('Content-Type', 'application/json');
  res.status(200).send('{id:"zDzgTJThFCaUojhRvFn9MGF22DOdeSwP",created:"20201030 11:30:00", expiration:"20201030 12:30:00"}');
});

app.get('/', (req,res) => {
  res.status(200).send('All your base are belong to us');
});

exports.paytify = app;