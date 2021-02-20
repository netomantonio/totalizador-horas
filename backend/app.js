const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const indexRoute = require('./Routes/index');

//BODY PARSER - necessário para reconhecer e poder extrair 
//as informações vindas do objeto json
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', indexRoute);

app.listen(process.env.PORT || 3000);

module.exports = app;