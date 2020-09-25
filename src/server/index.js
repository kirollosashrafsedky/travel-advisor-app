var path = require('path')
const express = require('express')
const dotenv = require('dotenv');
const request = require('request');

const port = process.env.PORT || 8081;
projectData = {};

dotenv.config();

const app = express()

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const cors = require('cors');
app.use(cors());
app.use(express.static('dist'))

console.log(__dirname)

app.get('/', function (req, res) {
    res.sendFile('dist/index.html')
})

// designates what port the app will listen to for incoming requests
app.listen(port, function () {
    console.log('Example app listening on port 8081!')
})

app.get('/test', function (req, res) {
  res.send({'test':'done'});
})
