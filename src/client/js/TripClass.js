export default class Trip {
  constructor(loc, weather, images) {
   this._loc = loc;
   this._weather = weather;
   this._images = images;
   this._notes = '';
   this._packingList = {};
   this._flightInfo = '';
 }

 get startingDate() {
   return this._startingDate;
 }
 get endDate() {
   return this._endDate;
 }
 get country() {
   return this._country;
 }

 set startingDate(date) {
   this._startingDate = date;
 }
 set endDate(date) {
   this._endDate = date;
 }
 set country(country) {
   this._country = country;
 }

}
