//= ReviewsControl.js
//= Carousel.js
//= SelectColor.js

$(document).ready(() => {
  const reviews = new ReviewsControl('json/reviews.json');

  const carousel = new Carousel();

  const selectColor = new SelectColor([
    {red: 'red'},
    {blue: 'blue'},
    {green: '#98FB98'}
  ]);

});
