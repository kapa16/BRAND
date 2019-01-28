$(document).ready(() => {
  //Меню логотипа
  const $logoMenu = $('.main-logo-menu');
  $logoMenu
    .fadeOut()
    .mouseleave(() => $logoMenu.fadeOut());
  $('.header')
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
});


