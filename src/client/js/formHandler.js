//imports
import Trip from './TripClass.js';

// variables and constants
const form = document.getElementById("main-form");
const serverBaseUrl = 'http://localhost:8081'; //will be changed if deployed on any live server as heroku
const startingDateInput = document.getElementById('trip-starting-date');
const endDateInput = document.getElementById('trip-end-date');
const locInput = document.getElementById('trip-loc');
const maxWeatherApiCount = 16;

// functions
function handleData(e){
  e.preventDefault();
  if (formValidate()){
    const startingDate = new Date(startingDateInput.value);
    let endDate;
    if(endDateInput.value != '') {
      endDate = new Date (endDateInput.value);
    }else{
      endDate = endDateInput.value;
    }
    const loc = locInput.value;
    const inputData = {
      'loc': loc
    }
    console.log('fetching......')
    postData(e,inputData)
    .then(outputdata => {
      console.log(outputdata);
      let weatherArr = getWeatherArr(outputdata, startingDate, endDate);
      let imgsObj = getImagesArr(outputdata.imagesData.hits);
      let newTrip = new Trip(locInput.value, weatherArr, imgsObj);
      newTrip.startingDate = startingDate;
      newTrip.endDate = endDate;
      newTrip.country = outputdata.geonamesData.geonames[0].countryName;
      console.log(newTrip);
      // startingDateInput.value = '';
      // locInput.value = '';
    })
  }
}

const postData = async (e, data={})=>{
    const response = await fetch(`${serverBaseUrl}/postdata`, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
    try {
      const newData = await response.json();
      return newData;
    }catch(error) {
      console.log("error", error);
    }
}

function formValidate(){
  if(startingDateInput.value == '' || locInput.value == ''){ //check if any required input is empty
    console.log('can\'t send empty data');
    return false;
  }
  if(!locInput.value.match(/^[A-Za-z ]+$/)){ //check for invalid characters in location
    console.log('Only letters and white spaces are allowed');
    return false;
  }
  const startingDate = new Date(startingDateInput.value);
  const currentDate = new Date();
  if(startingDate <= currentDate){ //check if starting date is over
    console.log('Starting date can\'t be before current date');
    return false;
  }
  if(endDateInput.value != '' && new Date(endDateInput.value) < startingDate){
    console.log('End date can\'t be before starting date');
    return false;
  }
  return true;
}

function daysBetDates(firstDate, secondDate){
  const diffInMilliSecs = firstDate - secondDate;
  const days = diffInMilliSecs / 1000 / 3600 / 24;
  return Math.ceil(days)
}

function getWeatherArr(data, startingDate, endDate){
  let weatherArr = [];
  const weekDays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  let noOfDays;
  if(endDate != ''){
    noOfDays = daysBetDates(endDate, startingDate) + 1;
  }else{
    noOfDays = 1;
  }
  let dataType = 'real';
  const startDateIndex = daysBetDates(startingDate, new Date())
  for(let i = 0; i < noOfDays;i++){
    let index = startDateIndex + i;
    if (index > maxWeatherApiCount - 1) {
      index = maxWeatherApiCount - 1;
      dataType = 'predicted';
    }
    const dayItem = data.weatherData.data[index];
    let date = new Date();
    date.setDate(startingDate.getDate() + i)
    weatherArr.push({
      'data-type': dataType,
      'date': date,
      'dateDisplay': `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`,
      'day': weekDays[date.getDay()],
      'temp': dayItem.temp,
      'max-temp': dayItem.max_temp,
      'min-temp': dayItem.min_temp,
      'weather-desc': dayItem.weather.description,
      'weather-icon': dayItem.weather.icon,
      'humidity': dayItem.rh
    })
  }
  return weatherArr;
}

function getImagesArr(inputArr){
  let imagesArr = [];
  inputArr.forEach((item, i) => {
    imagesArr.push({
      'imgUrl': item.largeImageURL
    })
  });
  return imagesArr;
}

function displayDate(date){
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const disp = `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
  return disp;
}

// event handlers
form.addEventListener('submit',handleData)

// exports
export { postData }
