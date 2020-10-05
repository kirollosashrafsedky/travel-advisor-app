# Travel Advisor Web App

## Introduction
This app is a node js website app that takes an input location and date, and returns images of the input location, and the complete forecast weather for the trip duration.

## App Design Features
1- Attractive UI/UX design planned using Adobe Illustrator.
<br><br>
2- Using Bootstrap 4 which makes the app responsive across different devices.
<br><br>
3- Using custom-made SVGs and images.
<br><br>
4- Using Webpack to build the project.
<br><br>
5- All styles are written in Sass.

## App Technical Features
1- Ability to add location and starting date (mandatory) and additional input for end date of the trip.
<br><br>
2- Strong form validation, checking if the input is empty, if special characters are entered, if the starting or end date are before current date,
if the end date is before the current date, with displaying error messages for users.
<br><br>
3- Displaying slider with four images at most for the entered location.
<br><br>
4- Displaying images of the country, if the entered location returns no results.
<br><br>
5- Displaying the Starting and End date of the trip besides calculation the trip duration.
<br><br>
6- Displaying the real and predicted weather forecast data for the entered location during the whole trip duration, <b>Average Temperature</b>, <b>Min Temperature</b>, <b>Max Temperature</b>, <b>Weather icon</b> and <b>Weather description</b>.
<i>Note: Predicted results mean the date is after 16 days from the current date.</i>
<br><br>
7- Ability to add or remove multiple trips.
<br><br>
8- Ability to save all trip data in the local storage.
<br><br>
9- The app serves an offline version when connection is lost due to using service workers.
<br><br>
10- Displaying no. of trips.
<br><br>
11- Optimization by minifying all the distribution code.

## Used Technology

`HTML5`,`Css3`,`Javascript`,`Sass`,`Bootstrap4`,`NodeJs`,`Express Server`,`Webpack`,`File-loader`,`Service Workers`

## Instructions to start the app

1- Add `.env` file in the root folder containing the api keys and user names instead of the `?` as follows..
<br>
`weatherbitApiKey=?`
<br>
`pixapayapikey=?`
<br>
`geonamesUsername=?`
<br>

2- Run `npm install` to install all the required packages.
<br>

3- Run `npm run build` to build for production
or `npm run build-dev` to build for development.

4- Run `npm start` to start the node server.

## About the developer
This app is completely designed and developed by Kirollos Ashraf Sedky.
The app is live at `https://travel-advisor-web-app.herokuapp.com/`
