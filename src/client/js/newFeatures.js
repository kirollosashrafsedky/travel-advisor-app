const nav = document.getElementById('main_nav');
const mainApp = document.getElementById('app');
const menuTrigger = document.getElementById('menu_trigger');
const menu = document.getElementById('menu');
const fullOverlay = document.getElementById('full-overlay');
const internalLinks = document.getElementsByClassName('internal');
const headerSearch = document.getElementById('header_search');
let navStatus = 'hidden';

function navAnimation(){
  if (window.scrollY > 1){
    nav.classList.add("navbar-down");
  }else{
    nav.classList.remove("navbar-down");
  }
}

function toggleMenu(){
  if(navStatus == 'hidden'){
    menu.classList.add('show');
    nav.classList.add('hide');
    app.classList.add('hide');
    fullOverlay.classList.add('show');
    navStatus = 'shown';
  }else{
    menu.classList.remove('show');
    nav.classList.remove('hide');
    app.classList.remove('hide');
    fullOverlay.classList.remove('show');
    navStatus = 'hidden';
  }
}

function smoothScroll(e){
  e.preventDefault();
  toggleMenu();
  const hash = this.hash;
  $('html, body').animate({
    scrollTop: $(hash).offset().top-170
  },500)
}

function openAddTripModal(e){
  e.preventDefault();
  const locInputOut = document.getElementById('loc-input-out');
  const searchTxt = locInputOut.value
  $('#add_trip_modal').modal('show')
  document.getElementById('trip-loc-input').value = searchTxt;
  locInputOut.value = '';
}

navAnimation();

window.addEventListener('scroll',navAnimation);
menuTrigger.addEventListener('click',toggleMenu);
fullOverlay.addEventListener('click',toggleMenu);
for (var i = 0; i < internalLinks.length; i++) {
  internalLinks.item(i).addEventListener('click',smoothScroll);
}
headerSearch.addEventListener('submit',openAddTripModal)
