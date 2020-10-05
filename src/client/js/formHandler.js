//imports
import Trip from './TripClass.js';

// variables and constants
const form = document.getElementById("add-form");
const submitAddForm = document.getElementById('submit-add-form');
const serverBaseUrl = 'https://travel-advisor-web-app.herokuapp.com'; //heroku link
const startingDateInput = document.getElementById('trip-starting-date-input');
const endDateInput = document.getElementById('trip-end-date-input');
const locInput = document.getElementById('trip-loc-input');
const errorAddForm = document.getElementById('error-add-form');
const tripsContainer = document.getElementById('trips-container');
const trips_no = document.getElementById('trips_no');
const confirmDelete = document.getElementById('confirm-delete');
const deleteAll = document.getElementById('delete-all');
const saveNotesBtn = document.getElementById('save-notes');
const addListItems = document.getElementById('add-list-items');
const luggageList = document.getElementById('luggage-list');
const addLuggageListForm = document.getElementById('add-luggage-list');
const maxWeatherApiCount = 16;
let tripArr = [];

// functions
checkStorage();
function checkStorage(){
  if(localStorage.getItem('tripsArr')){
    tripArr = JSON.parse(localStorage.getItem('tripsArr'));
    for(let trip in tripArr){
      printToHtml(tripArr[trip]);
    }
  }
  updateTripNo();
}

$('#add_trip_modal').on('hidden.bs.modal', function (e) {
  locInput.value = '';
  startingDateInput.value = '';
  endDateInput.value = '';
  errorAddForm.innerHTML = '';
})

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
    postData(e,inputData)
    .then(outputdata => {
      if(!outputdata.dataAvailable){
        errorAddForm.innerHTML = 'can\'t find your location, Try searching nearby famous locations';
      }else{
        let weatherArr = getWeatherArr(outputdata, startingDate, endDate);
        let imgsObj = {};
        if(outputdata.imagesAvailable) imgsObj = getImagesArr(outputdata.imagesData.hits);
        let newTrip = new Trip(locInput.value, weatherArr, imgsObj);
        newTrip.startingDate = startingDate;
        newTrip.endDate = endDate;
        newTrip.country = outputdata.geonamesData.geonames[0].countryName;
        tripArr.push(newTrip);
        updateStorage();
        printToHtml(newTrip);
        updateTripNo();
        $('html, body').animate({
          scrollTop: $('#trips').offset().top-170
        },500)
        $('#add_trip_modal').modal('hide');
      }
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
    errorAddForm.innerHTML = 'can\'t send empty data';
    return false;
  }
  if(!locInput.value.match(/^[A-Za-z ]+$/)){ //check for invalid characters in location
    errorAddForm.innerHTML = 'Only letters and white spaces are allowed';
    return false;
  }
  const startingDate = new Date(startingDateInput.value);
  const currentDate = new Date();
  if(startingDate <= currentDate){ //check if starting date is over
    errorAddForm.innerHTML = 'Starting date can\'t be before current date';
    return false;
  }
  if(endDateInput.value != '' && new Date(endDateInput.value) < startingDate){
    errorAddForm.innerHTML = 'End date can\'t be before starting date';
    return false;
  }
  errorAddForm.innerHTML = '';
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
      'imgUrl': item.webformatURL
    })
  });
  return imagesArr;
}

function displayDate(date){
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const disp = `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
  return disp;
}

function printToHtml(tripObj){
  const tempTrip = document.createDocumentFragment();
  const innerData = document.createElement('div');
  innerData.classList.add('trip-wrapper');
  innerData.id = `trip-${tripObj.id}`;
  let html = `
      <div class="row no-gutters">
        <div class="col-12 col-lg-6">`;
        if(JSON.stringify(tripObj.images) != '{}'){
          html += `
                  <div id="trip-carousel-${tripObj.id}" class="carousel slide" data-ride="carousel">
                    <ol class="carousel-indicators">`;
                    for(let item in tripObj.images){
                      let className = (item == 0) ? 'active' : '';
                      html += `<li data-target="#trip-carousel-${tripObj.id}" data-slide-to="${item}" class="${className}"></li>`;
                    }
          html += `
                    </ol>
                    <div class="carousel-inner">
                      `;
                      for(let item in tripObj.images){
                        let active = (item == 0) ? 'active' : '';
                        html += `<div class="carousel-item ${active}">
                                   <div class="carousel-img" style="background-image:url('${tripObj.images[item].imgUrl}')"></div>
                                 </div>`;
                      }

          html += `
                    </div>
                    <a class="carousel-control-prev" href="#trip-carousel-${tripObj.id}" role="button" data-slide="prev">
                      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                      <span class="sr-only">Previous</span>
                    </a>
                    <a class="carousel-control-next" href="#trip-carousel-${tripObj.id}" role="button" data-slide="next">
                      <span class="carousel-control-next-icon" aria-hidden="true"></span>
                      <span class="sr-only">Next</span>
                    </a>
                  </div>`;
        }else{
          html += `<div class="error-img" style="background-image:url('../images/jpg/image-not-found.jpg')"></div>`;
        }

  html += `
        </div>
        <div class="col-12 col-lg-6 overflow-hidden">
          <div class="overlay-img" style="background-image:url('${(JSON.stringify(tripObj.images) != '{}') ? tripObj.images[0].imgUrl : ''}')"></div>
          <div class="overlay"></div>
          <div class="trip-data-grid">
            <div class="loc-data p-2 p-sm-3 p-lg-3">
              <h2 class="mb-0">${tripObj.loc}</h2>
              <p class="country">${tripObj.country}</p>
              <div class="row w-100 no-gutters">
                <div class="col-12 col-lg-4">
                  <p>From <span>${displayDate(new Date(tripObj.startingDate))}</span></p>
                </div>
                <div class="col-12 col-lg-4">
                  <p>To <span>${(tripObj.endDate) ? displayDate(new Date(tripObj.endDate)) : 'Not specified'}</span></p>
                </div>
                <div class="col-12 col-lg-4 d-flex flex-column justify-content-center">
                  <p>Duration <span>${(tripObj.endDate) ? daysBetDates(new Date(tripObj.endDate), new Date(tripObj.startingDate)) + 1 + (daysBetDates(new Date(tripObj.endDate), new Date(tripObj.startingDate)) == 0 ? ' day' : ' days') : 'Not specified'}</span></p>
                </div>
              </div>
            </div>
            <div class="main-weather-data p-2 p-sm-3 p-lg-2 p-xl-3">
              <p class="day text-center mb-0">${tripObj.weather[0]['day']}, ${tripObj.weather[0]['dateDisplay']}</p>
              <div class="d-flex mr-3">
                <img class="img-fluid weather-icon" src="../images/weather-icons/${tripObj.weather[0]['weather-icon']}.png" alt="weather icon">
                <p class="main-temp temp m-0">${tripObj.weather[0]['temp']}</p>
              </div>
              <div class="row no-gutters w-100">
                <div class="col">
                  <img src="../images/svg/humidity.svg" alt="">
                  <span>${tripObj.weather[0]['humidity']}%</span>
                  <p class="weather-desc">${tripObj.weather[0]['weather-desc']}</p>
                </div>
                <div class="col text-right pr-3">
                  <img src="../images/svg/arrow-up.svg" alt="">
                  <span class="temp small-temp">${tripObj.weather[0]['max-temp']}</span>
                  <br>
                  <img src="../images/svg/arrow-down.svg" alt="">
                  <span class="temp small-temp">${tripObj.weather[0]['min-temp']}</span>
                </div>
              </div>
            </div>
            <div class="luggage-data p-2 p-sm-3 p-lg-3" data-id="${tripObj.id}">
              Luggage list
            </div>
            <div class="notes-data p-2 p-sm-3 p-lg-3" data-id="${tripObj.id}">
              Notes
            </div>
          </div>
        </div>
      </div>`;
      if(tripObj.endDate){
        html += `
        <div class="row no-gutters rest-weather">`;
        for(let day in tripObj.weather){
          if(day == 0) continue;
          if(tripObj.weather[day]['data-type'] == 'predicted'){
            html += `
            <div class="col-6 col-sm-4 col-md-3 col-lg-2">
              <div class="sm-weather-card d-flex flex-column justify-content-center align-items-center">`;
              if(day == tripObj.weather.length - 1) {
                html += `
                    <p class="day-sm text-center"><span>${tripObj.weather[day]['day']}<br>${tripObj.weather[day]['dateDisplay']}</span></p>
                    `;
              }else{
                html += `
                    <p class="day-sm text-center">From <span>${tripObj.weather[day]['dateDisplay']}</span><br>To <span>${tripObj.weather[tripObj.weather.length - 1]['dateDisplay']}</span></p>
                    `;
              }
            html += `
                <img class="img-fluid weather-icon" src="../images/weather-icons/${tripObj.weather[day]['weather-icon']}.png" alt="weather icon">
                <p class="temp m-0">${tripObj.weather[day]['temp']}</p>
                <p class="m-0 sm-note">Predicted temp.</p>
              </div>
            </div>`;
            break;
          }
          html += `
          <div class="col-6 col-sm-4 col-md-3 col-lg-2">
            <div class="sm-weather-card d-flex flex-column justify-content-center align-items-center">
              <p class="day text-center">${tripObj.weather[day]['day']}<br>${tripObj.weather[day]['dateDisplay']}</p>
              <img class="img-fluid weather-icon" src="../images/weather-icons/${tripObj.weather[day]['weather-icon']}.png" alt="weather icon">
              <p class="temp m-0">${tripObj.weather[day]['temp']}</p>
            </div>
          </div>`;
        }
        html += `
        </div>`;
      }
  html +=`
      <form class="text-center">
        <button type="button" class="delete-btn btn btn-danger px-5 py-3 my-2" data-id="${tripObj.id}">Delete Trip</button>
      </form>
  `;
  innerData.innerHTML += html;
  tempTrip.appendChild(innerData);
  tripsContainer.appendChild(tempTrip);
}

function updateStorage(){
  localStorage.clear();
  localStorage.setItem('tripsArr',JSON.stringify(tripArr));
}

function searchTrip(id){
  for (let trip in tripArr){
    if(tripArr[trip].id == id){
      return tripArr[trip];
    }
  }
}

function updateTripNo() {
  let trips_no_suffix = " trips";
  deleteAll.classList.remove('d-none');
  if (tripArr.length == 1){
    trips_no_suffix = " trip";
  }else if(tripArr.length == 0){
    deleteAll.classList.add('d-none');
  }
  trips_no.innerHTML = tripArr.length + trips_no_suffix;
}

function handleModalTriggers(e){
  if(e.target.classList.contains('delete-btn')){
    openDeleteModal(e);
  }else if(e.target.classList.contains('luggage-data')){
    openLuggageModal(e);
  }else if(e.target.classList.contains('notes-data')){
    openNotesModal(e);
  }
}

function openDeleteModal(e){
  e.preventDefault();
  const deleteMsgP = document.getElementById('delete-msg');
  const id = e.target.getAttribute('data-id');
  let deleteMsg;
  if(id == 'all'){
    deleteMsg = `Are you sure you want to delete all trips?`;
  }else{
    const trip = searchTrip(id);
    deleteMsg = `Are you sure you want to delete this trip? <br>${trip.loc}, ${trip.country}`;
  }
  confirmDelete.setAttribute('data-id', id);
  deleteMsgP.innerHTML = deleteMsg;
  $('#delete_trip_modal').modal('show')
}

function openNotesModal(e){
  const id = e.target.getAttribute('data-id');
  saveNotesBtn.setAttribute('data-id', id);
  const trip = searchTrip(id);
  document.getElementById('notes-input').value = trip.notes;
  $('#notes_trip_modal').modal('show')
}

function openLuggageModal(e){
  const id = e.target.getAttribute('data-id');
  addListItems.setAttribute('data-id', id);
  const trip = searchTrip(id);
  refreshLuggageList(trip);
  $('#luggage_trip_modal').modal('show');
}

function deleteTrip(e){
  const id = e.target.getAttribute('data-id');
  if(id == 'all'){
    tripArr = [];
    tripsContainer.innerHTML = '';
  }else{
    for(let trip in tripArr){
      if(id == tripArr[trip].id){
        tripArr.splice(trip, 1);
      }
    }
    const tripDiv = document.getElementById(`trip-${id}`);
    tripDiv.remove();
  }
  $('#delete_trip_modal').modal('hide')
  updateStorage();
  updateTripNo();
}

function saveNotes(e){
  const id = e.target.getAttribute('data-id');
  for(let trip in tripArr){
    if(id == tripArr[trip].id){
      tripArr[trip].notes = document.getElementById('notes-input').value;
    }
  }
  $('#notes_trip_modal').modal('hide');
  updateStorage();
}

function addLuggageList(e){
  e.preventDefault();
  const id = e.target.getAttribute('data-id');
  const trip = searchTrip(id);
  const listInput = document.getElementById('list-input');
  if(listInput.value != ''){
    trip.luggageList[Object.keys(trip.luggageList).length] = listInput.value;
    refreshLuggageList(trip);
    listInput.value = '';
  }
  updateStorage();
}

function refreshLuggageList(trip){
  let html;
  if(JSON.stringify(trip.luggageList) == '{}'){
    html = `<p class="text-danger text-center mb-0">The list is empty</p>`;
  }else{
    html = `<ul>`;
    for (const item in trip.luggageList){
      html += `
        <li data-id="${item}">
          <div class="row no-gutters">
            <div class="col-10 d-flex align-items-center">
              <p class="m-0">${trip.luggageList[item]}</p>
            </div>
            <div class="col-2 d-flex align-items-center justify-content-end">
              <button type="button" class="delete-list-btn btn btn-danger py-0 px-2" data-id="${item}">
                x
              </button>
            </div>
          </div>
        </li>`;
    }
    html += `</ul>`
  }
  luggageList.innerHTML = html;
}

function deleteLuggageItems(e) {
  if(e.target.classList.contains('delete-list-btn')){
    const listId = e.target.getAttribute('data-id');
    const id = addListItems.getAttribute('data-id');
    const trip = searchTrip(id);
    delete trip.luggageList[listId];
    refreshLuggageList(trip);
    updateStorage();
  }
}

// event handlers
submitAddForm.addEventListener('click',handleData);
form.addEventListener('submit',handleData)
confirmDelete.addEventListener('click',deleteTrip);
saveNotesBtn.addEventListener('click',saveNotes);
document.body.addEventListener('click',handleModalTriggers);
addListItems.addEventListener('click',addLuggageList);
addLuggageListForm.addEventListener('submit',addLuggageList);
luggageList.addEventListener('click',deleteLuggageItems);

// exports
export {postData}
export { displayDate }
