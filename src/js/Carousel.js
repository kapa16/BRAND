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
   * @param {Number} direction - направление смены изображения
   * @private
   */
  _changeSlide(direction) {
    const $currentElement = $('.carousel__block:visible');
    const $carouselElements = $('.carousel__block');

    const currentIndex = $currentElement.index();
    const lastElementIndex = $carouselElements.length - 1;
    const nextIndex = this._getNextElementIndex(direction, currentIndex, lastElementIndex);

    $currentElement.hide();
    $carouselElements.eq(nextIndex).show();
  }

  /**
   * Получает индекс следующего элемента карусели, исходя из направления смены элементов
   * @param {Number} direction - направление смены
   * @param {Number} currentIndex - индекс текущего видимого элемента
   * @param {Number} lastElementIndex - индекс последнего элемента в коллекции
   * @returns {Number} - индекс следующего элемента
   * @private
   */
  _getNextElementIndex(direction, currentIndex, lastElementIndex) {
    let nextIndex = currentIndex + direction;
    if (nextIndex < 0) {
      nextIndex = lastElementIndex;
    } else if (nextIndex > lastElementIndex) {
      nextIndex = 0;
    }
    return nextIndex;
  }
}
