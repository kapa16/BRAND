class Carousel {
  /**
   * Конструктор класса карусели
   * @param {String} containerSelector - строка с селектором класса контейнера
   */
  constructor(containerSelector = '.carousel') {
    this.containerSelector = containerSelector;
    this._init();
  }

  /**
   * Инициализация
   * @private
   */
  _init() {
    this._addHandlers();
  }

  /**
   * Добавление слушателя событий нажатия на кнопки смены изображений
   * @private
   */
  _addHandlers() {
    $(this.containerSelector).on('click', '.carousel__control', evt => this._onControlClick(evt))
  }

  /**
   * Обработка нажатий на кнопки смены изображений
   * @param {Event} evt - событие нажатия на кнопку
   * @private
   */
  _onControlClick(evt) {
    let direction = 1;
    if ($(evt.target).closest('.carousel__control').hasClass('carousel__prev')) {
      direction = -1;
    }
    this._changeSlide(direction);
  }

  /**
   * Меняет изображение в переданном направлении
   * @param {integer} direction - направление смены изображения
   * @private
   */
  _changeSlide(direction) {
    const $currentElement = $('.carousel__block:visible');
    let $nextElement = $currentElement;
    if (direction === 1) {
      $nextElement = $currentElement.next('.carousel__block');
      if (!$nextElement.length) {
        $nextElement = $('.carousel__block').first();
      }
    } else {
      $nextElement = $currentElement.prev('.carousel__block');
      if (!$nextElement.length) {
        $nextElement = $('.carousel__block').last();
      }
    }
    $nextElement.show();
    $currentElement.hide();
  }
}
