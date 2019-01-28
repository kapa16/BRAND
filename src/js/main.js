// = ../libs/jquery/dist/jquery.js
// = ../libs/jquery-ui/jquery-ui.js

//= menu-control.js
//= Cart.js
//= Accordion.js

$(document).ready(() => {

  $(window).scroll(() => {
    if ($(this).scrollTop() > 40) {
      $('.header').height(60);
    } else if ($(this).scrollTop() === 0) {
      $('.header').height(100);
    } else {
      $('.header').height(100 - $(this).scrollTop());
    }
  });

  // Корзина
  let cart = new Cart('json/getCart.json');

  // Добавление товара
  $('.add-cart-wrap').click(evt => {
    cart.addProduct(evt);
  });
  // Очистка корзины
  $('.clear-cart-btn').click(evt => {
    cart.clearCart(evt);
  });

  //sidebar
  const accordion = new Accordion('.sidebar');

  $(".slider-control-wrap").on("click", evt => {
    $(".slider-control-wrap .slider-control").removeClass("active");
    $(evt.target).addClass("active");
  });

});

