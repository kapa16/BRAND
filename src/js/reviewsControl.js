class ReviewsControl {
  constructor(source, container = '#reviews-container', form = '#review-form') {
    this.source = source;
    this.container = container;
    this.form = form;
    this.reviews = [];
    this._init();
  }

  _init() {
    this._renderForm();
    fetch(this.source)
      .then(result => result.json())
      .then(data => {
        for (const review of data) {
          this.reviews.push(review);
          this._renderReview(review)
        }
      })
  }

  _renderForm() {
    const $labelUser = $('<label class="form-elements" for="userName">Введите имя</label>');
    const $userId = $('<input class="form-elements" type="text" name="userName" id="userName">');
    $labelUser.append($userId);

    const $text = $('<textarea/>', {
      id: 'reviewText',
      class: "form-elements",
      name: "review",
      cols: "30",
      rows: "10",
      placeholder: "Напишите отзыв"
    });
    const $btn = $('<button class="form-elements" type="submit">Отправить</button>');

    $(this.form)
      .append($labelUser)
      .append($text)
      .append($btn)
      .submit(evt => this._onFormSubmit(evt));
  }

  _renderReview(review) {
    const $reviewWrap = $(`<div class="review" data-id="${review.id}"></div>`);
    const $reviewRating = this._getReviewRatingElement();

    const $userName = $(`<p class="review__user  brand-style">${review.author}</p>`);
    const $reviewText = $(`<p class="review__text">${review.text}</p>`);
    const $content = $('<div class="review__content"></div>');
    $content
      .append($userName)
      .append($reviewText);

    const $control = $('<div class="review__control"></div>');

    const $deleteBtn = $(`<div class="fas fa-times-circle delete-product" data-id="${review.id}"></div>`);
    $deleteBtn.click(evt => this._onDeleteClick(evt));
    $control.append($deleteBtn);

    if (review.approved) {
      $reviewWrap.addClass('approved');
    } else {
      const $approveBtn = $(`<div class="button-black review__btn" data-id="${review.id}">Approve</div>`);
      $approveBtn.click(evt => this._onApproveClick(evt));
      $control.append($approveBtn);
    }

    $reviewWrap
      .append($reviewRating)
      .append($content)
      .append($control)
      .prependTo($(this.container));
  }

  _getReviewRatingElement() {
    const $reviewRating = $('<div class="review__rating"></div>');
    for (let i = 0; i < 5; i++) {
      $reviewRating.append('<i class="fas fa-star rating-star"></i>');
    }
    return $reviewRating;
  }

  _getReviewWrap(targetEl) {
    return $(targetEl)
      .closest('.review');
  }

  _findReview(id) {
    for (const review of this.reviews) {
      if (review.id === +id) {
        return review;
      }
    }
  }

  _onApproveClick(evt) {
    this._getReviewWrap(evt.target).addClass('approved')
    const reviewId = evt.target.dataset.id;

    this._findReview(reviewId).approved = true;

    $(evt.target).remove();
  }

  _onDeleteClick(evt) {
    const review = this._findReview(evt.target.dataset.id);
    this.reviews.splice(this.reviews.indexOf(review), 1);
    this._getReviewWrap(evt.target).remove();
  }

  _getLastReviewId() {
    const ids = this.reviews.map(obj => obj.id);
    return Math.max(...ids) + 1;
  }

  _addReview() {
    const newreview = {
      id: this._getLastReviewId(),
      author: $('#userName').val(),
      text: $('#reviewText').val()
    };
    this.reviews.push(newreview);
    this._renderReview(newreview);
  }

  _onFormSubmit(evt) {
    evt.preventDefault();
    if (!this.validateForm()) {
      alert('Необходимо заполнить форму');
    }
    this._addReview();
    $('#userName').val('');
    $('#reviewText').val('');
  }

  validateForm() {
    return this._checkField('#userName') && this._checkField('#reviewText');
  }

  _checkField(selector) {
    return $(selector).val().length !== 0;
  }
}