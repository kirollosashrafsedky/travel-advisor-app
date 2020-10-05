import { postData } from './js/formHandler'
import { navAnimation } from './js/newFeatures'
import 'bootstrap';  //include bootstrap js
import 'bootstrap/scss/bootstrap.scss';   //include bootstrap scss
import './style/main.scss';
require.context('./images/weather-icons/', true);
import './images/jpg/image-not-found.jpg';
import './images/svg/humidity.svg';
import './images/svg/arrow-up.svg';
import './images/svg/arrow-down.svg';

export{
  postData
}
