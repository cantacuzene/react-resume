/* eslint-disable */
var express = require('express');
var path = require('path');
const config = require('./src/config/config')
var port = process.env.PORT || 3333;
var app = express();

app.use(express.static(path.join(__dirname, 'dist')));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.get('/api/Languages', (_req, res) => {
  res.sendFile(path.join(__dirname, 'data/Languages.json'));
});

app.get('/api/Skills', (_req, res) => {
  res.sendFile(path.join(__dirname, 'data/Skills.json'));
});

app.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`server started port: ${port}`);
  }
});