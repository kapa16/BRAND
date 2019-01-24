class SelectColor {
  constructor(colorItems, containerId = '#color') {
    this.colorItems = colorItems;
    this.containerId = containerId;
    this.currenColor = {};
    this._init();
  }

  _init() {
    this._createList();
  }
  _createList() {
    const $listWrap = $('<ul class="select__items">');
    for (const color in this.colorItems) {
      const $colorExample = $('<span class="color-example"></span>').css('background', this.colorItems[color]);
      $listWrap
        .append($(`<li class="select__item">${color}</li>`)
          .append($colorExample));
    }
    $listWrap
      .hide()
      .appendTo($(this.containerId));

    $(this.containerId).find('.color-select').after(`<span>Red</span>`);
  }
}