//= ReviewsControl.js
//= Carousel.js
//= SelectColor.js

$(document).ready(() => {
  const reviews = new ReviewsControl('json/reviews.json');

  const carousel = new Carousel();

  const selectColor = new SelectColor([
    {name: 'red', color: 'red'},
    {name: 'blue', color: 'blue'},
    {name: 'green', color: '#98FB98'}
  ]);

});
