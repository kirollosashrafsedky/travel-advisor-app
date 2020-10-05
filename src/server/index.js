var path = require('path')
const express = require('express')
const dotenv = require('dotenv');
const request = require('request');
dotenv.config();

const geonames = {
  'username' : process.env.geonamesUsername,
  'baseUrl' : 'http://api.geonames.org/searchJSON?&maxRows=10&username=',
  'urlPartTwo' : '&q='
}
const weatherbit = {
  'apiKey' : process.env.weatherbitApiKey,
  'baseUrl' : 'https://api.weatherbit.io/v2.0/forecast/daily?&lat=',
  'urlPartTwo' : '&lon=',
  'urlPartThree' : '&key='
}
const pixabay = {
  'apiKey' : process.env.pixapayapikey,
  'baseUrl' : 'https://pixabay.com/api/?per_page=4&key=',
  'urlPartTwo' : '&q='
}
const port = process.env.PORT || 8081;
inputData = {};
outputData = {};
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
    console.log(`Example app listening on port ${port}!`)
})

app.post('/postdata',handleInput);

async function handleInput(req, res){
 inputData = req.body;
 outputData ={};
 const geonamesData = await getData(`${geonames.baseUrl}${geonames.username}${geonames.urlPartTwo}${inputData.loc}`);
 if(geonamesData.geonames.length >= 1){ //check if lat and long are available before searching the weather
   const weatherData = await getData(`${weatherbit.baseUrl}${geonamesData.geonames[0].lat}${weatherbit.urlPartTwo}${geonamesData.geonames[0].lng}${weatherbit.urlPartThree}${weatherbit.apiKey}`);
   outputData.weatherData = weatherData;
   outputData.geonamesData = geonamesData;
   outputData.dataAvailable = true;
   let imagesData = await getData(`${pixabay.baseUrl}${pixabay.apiKey}${pixabay.urlPartTwo}${inputData.loc}`);
   if(imagesData.hits.length >= 1){
     outputData.imagesData = imagesData;
     outputData.imagesAvailable = true;
   }else{
     imagesData = await getData(`${pixabay.baseUrl}${pixabay.apiKey}${pixabay.urlPartTwo}${geonamesData.geonames[0].countryName}`);
     if(imagesData.hits.length >= 1){
       outputData.imagesData = imagesData;
       outputData.imagesAvailable = true;
     }else{
       outputData.imagesAvailable = false;
     }
   }
 }else{
   outputData.dataAvailable = false;
 }
 res.send(outputData);
}

function getData(fullUrl){
  return new Promise(function (resolve, reject) {
    request(fullUrl, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        const data = JSON.parse(body);
        resolve(data);
      }else{
        console.log('An error happened while fetching ' + fullUrl)
      }
    });
  });
}
