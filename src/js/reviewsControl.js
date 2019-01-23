class CommentsControl {
  constructor(source, container = '#comments-container', form = '#comment-form') {
    this.source = source;
    this.container = container;
    this.form = form;
    this.comments = [];

    this._init();

  }

  _init() {
    this._renderForm();
    fetch(this.source)
      .then(result => result.json())
      .then(data => {
        for (const comment of data) {
          this.comments.push(comment);
          this._renderComment(comment)
        }
      })
  }

  _renderForm() {
    const $labelUser = $('<label class="form-elements" for="userName">Введите имя</label>');
    const $userId = $('<input class="form-elements" type="text" name="userName" id="userName">');
    $labelUser.append($userId);

    const $text = $('<textarea/>', {
      id: 'commentText',
      class: "form-elements",
      name: "comment",
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

  _renderComment(comment) {
    const $commentWrap = $(`<div class="comment" data-id="${comment.id}"></div>`);
    const $userName = $(`<p class="comment-user">${comment.author}</p>`);
    const $top = $('<div class="comment-top"></div>');
    $top.append($userName);

    if (comment.approved) {
      $commentWrap.addClass('approved');
    } else {
      const $approveBtn = $(`<button class="btn" data-id="${comment.id}">Одобрить</button>`);
      $approveBtn.click(evt => this._onApproveClick(evt));
      $top.append($approveBtn);
    }
    const $deleteBtn = $(`<button class="btn" data-id="${comment.id}">X</button>`);
    $deleteBtn.click(evt => this._onDeleteClick(evt));
    $top.append($deleteBtn);

    const $commentText = $(`<p class="comment-text">${comment.text}</p>`);

    $commentWrap
      .append($top)
      .append($commentText)
      .prependTo($(this.container));
  }

  _getCommentWrap(targetEl) {
    return $(targetEl)
      .closest('.comment');
  }

  _findComment(id) {
    for (const comment of this.comments) {
      if (comment.id === +id) {
        return comment;
      }
    }
  }

  _onApproveClick(evt) {
    this._getCommentWrap(evt.target).addClass('approved')
    const commentId = evt.target.dataset.id;

    this._findComment(commentId).approved = true;

    $(evt.target).remove();
  }

  _onDeleteClick(evt) {
    const comment = this._findComment(evt.target.dataset.id);
    this.comments.splice(this.comments.indexOf(comment), 1);
    this._getCommentWrap(evt.target).remove();
  }

  _getLastCommentId() {
    const ids = this.comments.map(obj => obj.id);
    return Math.max(...ids) + 1;
  }

  _addComment() {
    const newComment = {
      id: this._getLastCommentId(),
      author: $('#userName').val(),
      text: $('#commentText').val()
    };
    this.comments.push(newComment);
    this._renderComment(newComment);
  }

  _onFormSubmit(evt) {
    evt.preventDefault();
    if (!this.validateForm()) {
      alert('Необходимо заполнить форму');
    }
    this._addComment();
    $('#userName').val('');
    $('#commentText').val('');
  }

  validateForm() {
    return this._checkField('#userName') && this._checkField('#commentText');
  }

  _checkField(selector) {
    return $(selector).val().length !== 0;
  }
}