class Pagination {
  constructor(countParts, container) {
    this.countParts = countParts;
    this.container = container;
    this.currentPart = 0;
    this.paginationItemSelector = '.pagination-link';
  }

  render(){
    const $paginationWrap = $('<div class="pagination-wrap"></div>');
    const $paginationContainer = $('<div class="pagination"></div>');
    $paginationContainer
      .append(`<a href="#" class="pagination-link pagination-link-prev"></a>`);
    for (let i = 0; i < this.countParts; i++) {
      const $paginationPart = $(`<a href="#" class="pagination-link">${i + 1}</a>`);
      if (this.currentPart === i) {
        $paginationPart.addClass('pagination-link-active');
      }
      $paginationContainer.append($paginationPart);
    }
    $paginationContainer
      .append('<a href="#" class="pagination-link pagination-link-next"></a>')
      .appendTo($paginationWrap
        .appendTo($(this.container)));
  }

  changePagination(evt) {
    evt.preventDefault();
    if ($(evt.target).hasClass('pagination-link-prev')) {
      if (--this.currentPart < 0) {
        this.currentPart = 0;
      }
    } else if ($(evt.target).hasClass('pagination-link-next')) {
      if (++this.currentPart > this.countParts - 1) {
        this.currentPart = this.countParts - 1;
      }
    } else {
      this.currentPart = +$(evt.target).text() - 1;
    }
  }
}