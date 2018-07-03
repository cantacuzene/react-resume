/* eslint-disable */
var express = require('express');
var path = require('path');
var port = process.env.PORT || 3333;
var app = express();

app.use(express.static(path.join(__dirname, 'dist')));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, `dist/${_req.params.lang}/index.html`));
});

app.get('/api/:lang/Languages', (_req, res) => {
  res.sendFile(path.join(__dirname, `data/${_req.params.lang}/Languages.json`));
});

app.get('/api/:lang/Skills', (_req, res) => {
  res.sendFile(path.join(__dirname, `data/${_req.params.lang}/Skills.json`));
});

app.get('/api/:lang/Educations', (_req, res) => {
  res.sendFile(path.join(__dirname, `data/${_req.params.lang}/Educations.json`));
});

app.get('/api/:lang/Experiences', (_req, res) => {
  res.sendFile(path.join(__dirname, `data/${_req.params.lang}/Experiences.json`));
});
app.get('/api/:lang/About', (_req, res) => {
  res.sendFile(path.join(__dirname, `data/${_req.params.lang}/About.json`));
});
app.get('/api/:lang/Titles', (_req, res) => {
  res.sendFile(path.join(__dirname, `data/${_req.params.lang}/Titles.json`));
});


app.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`server started port: ${port}`);
  }
});