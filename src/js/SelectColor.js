class SelectColor {
  constructor(colorItems, containerId = '#color') {
    this.colorItems = colorItems;
    this.containerId = containerId;
    this.currenColor = {name: 'no color', color: 'rgba(0,0,0,0)'};
    this.$listWrap = $('<ul/>');
    this._init();
  }

  _init() {
    if (this.colorItems.length) {
      this.currenColor = this.colorItems[0];
      this._createList();
      $(this.containerId).click(() => this.$listWrap.toggle());
      $(this.containerId).on('click', '.select__item', evt => this._onChooseItem(evt))
    }
    this._createMainElement();
    this._setChosenItem();
  }

  _createMainElement() {
    $(this.containerId)
      .append($('<span class="color-example color-select"></span>'))
      .append(`<span class="color-name"></span>`)
      .append('<i class="fas fa-angle-down icon-drop-list"></i>');
  }

  _createList() {
    this.$listWrap = $('<ul class="select__items">');
    this.colorItems.forEach((item) => {
      const $colorExample = $('<span class="color-example"></span>').css('background', item.color);
      this.$listWrap
        .append($(`<li class="select__item">${item.name}</li>`)
          .append($colorExample));
    });
    this.$listWrap
      .hide()
      .appendTo($(this.containerId));
  }

  _setChosenItem() {
    $(this.containerId)
      .find('.color-select')
        .css('background', this.currenColor.color);
    $(this.containerId)
      .find('.color-name')
      .text(this.currenColor.name);
  }

  _onChooseItem(evt){
    const colorName = $(evt.target).text();
    this.currenColor = this.colorItems.find(element => element.name === colorName);
    this._setChosenItem();
  }
}