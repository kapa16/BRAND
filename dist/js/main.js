//= jquery.js

function showMenu(classMenu) {
    $(classMenu).addClass("menu-show");
};

function hideMenu(classMenu, elem) {
    classMenu.removeClass("menu-show");
};

$(document).ready(function () {

    $(".logo-brand").on("mouseenter", function () {
        showMenu(".main-logo-menu");
    });

    $(".browse").on("mouseenter", function () {
        showMenu(".browse-menu");
    });

    $(".cart-header").on("mouseenter", function () {
        showMenu(".cart-menu");
    });

    $(document).on("click", function (elem) {
        hideMenu($(".main-logo-menu"), elem);
        hideMenu($(".browse-menu"), elem);
        hideMenu($(".cart-menu"), elem);
    });


    $(".slider-control-wrap").on("click", function () {
        $(".slider-control-wrap .slider-control").removeClass("active");
        $(".slider-control", this).addClass("active");
    });

});
