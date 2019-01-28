class Accordion {
  constructor(containerClass) {
    this.containerClass = containerClass;
    this._init();
  }

  /**
   * Инициализация - добавляем слушатель событий
   * @private
   */
  _init(){
    $(this.containerClass).find('.sidebar-title').click(evt => this._toggleMenu(evt));
  }

  /**
   * Открытие / скрытие меню
   * @param {Event} evt событие нажатия на заголовок меню
   * @private
   */
  _toggleMenu(evt) {
    $('.menu-open').removeClass('menu-open');

    const $currentTitle = $(evt.target).closest('.sidebar-title');

    const $currentElOpen = $currentTitle.next();

    $(this.containerClass).find('.sidebar-submenu').not($currentElOpen[0]).slideUp();

    $currentElOpen.slideToggle('fast', () => {
      if ($currentElOpen.is(':visible')) {
        $currentTitle.closest('li').addClass('menu-open');
      }
    });

  }
}