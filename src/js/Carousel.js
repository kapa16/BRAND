class Carousel {
  constructor(containerClass = '.carousel') {
    this.containerClass = containerClass;
    this._init();
  }

  _init() {
    this._addHandlers();
  }

  _addHandlers() {
    $(this.containerClass).on('click', '.carousel__control', evt => this._onControlClick(evt))
  }

  _onControlClick(evt) {
    let direction = 1;
    if ($(evt.target).closest('.carousel__control').hasClass('carousel__prev')) {
      direction = -1;
    }
    this._changeSlide(direction);
  }

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
