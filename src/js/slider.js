class Slider {
  constructor(minValue, maxValue) {
    this.leftPoint = 0;
    this.rightPoint = 0;
    this.rangePoints = 0;
    this.offset = 0;
    this.widthPoint = 0;
    this.maxValue = maxValue;
    this.minValue = minValue;
    this._init();
  }

  _init() {
    const $leftPoint = $('.products-filter-point-left');
    this.leftPoint = $leftPoint.position().left;
    this.offset = $leftPoint.offset().left;
    this.widthPoint = $leftPoint.width();
    this.rightPoint = $('.products-filter-point-right').position().left - this.widthPoint;
    this.rangePoints = this.rightPoint - this.leftPoint;

    $('.products-filter-point').draggable({
      axis: 'x',
      containment: '.products-filter-slider'
    })
      .on('drag', (evt, ui) => this._dragHandler(evt))
      .on('dragstop', (evt, ui) => this._dragStopHandler(evt));
  }

  _dragHandler(evt) {
    this._calcPositions(evt);
  }

  _dragStopHandler(evt) {
    this._calcPositions(evt)
  }

  _calcPositions(evt) {
    this.leftPoint = $('.products-filter-point-left').position().left;
    this.rightPoint = $('.products-filter-point-right').position().left - this.widthPoint;

    if ((this.leftPoint) >= this.rightPoint) {
      if ($(evt.target).hasClass('products-filter-point-left') && this.leftPoint > this.widthPoint / 2) {
        $(evt.target).offset({left: this.offset + this.rightPoint - 1});
      } else {
        $(evt.target).offset({left: this.offset + this.leftPoint + this.widthPoint + 1});
      }
      evt.preventDefault();
    }
    $('.products-filter-bar')
      .offset({left: this.offset + this.leftPoint + 5})
      .width(this.rightPoint - this.leftPoint + this.widthPoint);

    this._fillValues();
  }

  _getValue(rangeValue, point) {
    return Math.floor(this.minValue + rangeValue / this.rangePoints * this[point]);
  }

  _fillValues() {
    const rangeValue = this.maxValue - this.minValue;
    $('.price-range-min').text(`$${this._getValue(rangeValue,'leftPoint')}`);
    $('.price-range-max').text(`$${this._getValue(rangeValue,'rightPoint')}`);
  }
}

const slider = new Slider(52, 400);