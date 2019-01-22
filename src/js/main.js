// = ../libs/jquery/dist/jquery.js
// = ../libs/jquery-ui/jquery-ui.js

//= Cart.js

$(document).ready(() => {

  // Корзина
  let cart = new Cart('json/getCart.json');

  // Добавление товара
  $('.add-cart-wrap').click(e => {
    cart.addProduct(e.target);
  });
  // Очистка корзины
  $('.clear-cart-btn').click(evt => {
    cart.clearCart(evt);
  });

});


































//--------------------Старый код, потом изменю ----------------------------------------------

function showMenu(classMenu) {
  $(classMenu).addClass("menu-show");
};

function hideMenu(classMenu, elem) {
  classMenu.removeClass("menu-show");
};

$(document).ready(function () {

  $(".cart-header").on("mouseenter", function () {
    showMenu(".cart-menu");
  });

  $(document).on("click", function (elem) {
    hideMenu($(".main-logo-menu"), elem);
    hideMenu($(".dropdown-box"), elem);
    hideMenu($(".cart-menu"), elem);
  });


  $(".slider-control-wrap").on("click", function () {
    $(".slider-control-wrap .slider-control").removeClass("active");
    $(".slider-control", this).addClass("active");
  });

  //=============== sidebar ===============
  $(function () {
    var Accordion = function (el, multiple) {
      this.el = el || {};
      // more then one submenu open?
      this.multiple = multiple || false;

      var dropdownlink = this.el.find('.sidebar-title');
      dropdownlink.on('click', {
          el: this.el,
          multiple: this.multiple
        },
        this.dropdown);
    };

    Accordion.prototype.dropdown = function (e) {
      var $el = e.data.el,
        $this = $(this),
        //this is the ul.submenuItems
        $next = $this.next();

      $next.slideToggle();
      $this.parent().toggleClass('menu-open');

      if (!e.data.multiple) {
        //show only one menu at the same time
        $el.find('.sidebar-submenu').not($next).slideUp().parent().removeClass('menu-open');
      }
    }

    var accordion = new Accordion($('.sidebar-menu'), false);
  })

});
