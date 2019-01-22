// = ../libs/jquery/dist/jquery.js
// = ../libs/jquery-ui/jquery-ui.js

//= Cart.js
//= Accordion.js

$(document).ready(() => {

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

  //Меню логотипа
  const $logoMenu = $('.main-logo-menu');
  $logoMenu
    .fadeOut()
    .mouseleave(() => $logoMenu.fadeOut());
  $('.logo-brand')
    .mousemove(() => $logoMenu.fadeIn());

  //Подменю логотипа
  const $logoSubMenu = $('.logo-menu-list .dropdown-box');
  $logoSubMenu
    .fadeOut()
    .mouseleave(() => $logoSubMenu.fadeOut());

  $('.logo-menu-list')
    .mouseenter(evt => {
      $(evt.target)
        .siblings('.dropdown-box').fadeIn()
        .mouseleave(() => $logoSubMenu.fadeOut());
    })
    .mouseleave(() => $logoSubMenu.fadeOut());

  //Меню browse
  const $browseMenu = $('.browse .dropdown-box');
  $browseMenu
    .fadeOut()
    .mouseleave(() => {
      $browseMenu.fadeOut()
    });
  $('.browse')
    .mousemove(() => $browseMenu.fadeIn())
    .mouseleave(() => $browseMenu.fadeOut());

  //sidebar
  const accordion = new Accordion('.sidebar');
});


//--------------------Старый код, потом изменю ----------------------------------------------

$(document).ready(function () {

  $(".slider-control-wrap").on("click", function () {
    $(".slider-control-wrap .slider-control").removeClass("active");
    $(".slider-control", this).addClass("active");
  });

});
