export default class Trip {
  constructor(loc, weather, images) {
   this.loc = loc;
   this.weather = weather;
   this.images = images;
   this.notes = '';
   this.luggageList = {};
   this.id = Date.now();
 }
}
