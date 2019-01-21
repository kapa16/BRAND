class Cart {
  constructor(source, container = '.cart-container') {
    this.source = source;
    this.container = container;
    this.countGoods = 0; // Общее кол-во товаров в корзине
    this.amount = 0; // Общая стоимость товаров в корзине
    this.cartItems = []; // Все товары
    this._init();
  }

  _init() {
    this._render();
    this._addEventHandlers();
    fetch(this.source)
      .then(result => result.json())
      .then(data => {
        for (let product of data.contents) {
          this.cartItems.push(product);
          this._renderItem(product);
        }
        this.countGoods = data.countGoods;
        this.amount = data.amount;
        this._renderSum();
      })
  }

  _render() {
    let $cartItemsDiv = $('<div/>', {
      class: 'basket-menu hidden'
    });
    let $totalPrice = $('<div/>', {
      class: 'cart-total'
    });
    $totalPrice.append('<p>TOTAL</p>');
    $totalPrice.append('<p class="cart-total-sum">$0.00</p>');

    const $cartButtons = $('<div/>', {
      class: 'cart-menu-buttons'
    });
    const $checkoutButton = $('<a/>', {
      href: 'checkout.html',
      class: 'cart-menu-button',
      text: 'Checkout'
    });
    const $cartButton = $('<a/>', {
      href: 'shopping-cart.html',
      class: 'cart-menu-button',
      text: 'Go to cart'
    });
    $cartButtons
      .append($checkoutButton)
      .append($cartButton);

    $cartItemsDiv
      .append('<div class="cart-items-wrap"></div>')
      .append($totalPrice)
      .append($cartButtons)
      .appendTo($(this.container));
  }

  _addEventHandlers() {
    $(this.container).mouseenter(() => this._showCartProducts());

    $(this.container).on('click', '.reduce-quantity', evt => this._onChangeQuantity(evt, -1));
    $(this.container).on('click', '.increase-quantity', evt => this._onChangeQuantity(evt, 1));
    $(this.container).on('click', '.delete-product', evt => this._onChangeQuantity(evt, 0, true));
  }

  _getMainItemContainer(className, id) {
    return $('<div/>', {
      class: className,
      'data-product': id
    });
  }

  _getImageElement(product) {
    return $('<img/>', {
      src: product.img_src,
      alt: product.img_alt,
    });
  }

  _getProductRatingElement() {
    const $productRating = $('<div class="product-rating"></div>');
    for (let i = 0; i < 5; i++) {
      $productRating.append('<i class="fas fa-star rating-star"></i>');
    }
    return $productRating;
  }

  _getDivElement(className, text = '') {
    return $(`<div class="${className}">${text}</div>`);
  }

  _getParagraphElement(className, text) {
    return $(`<p class="${className}">${text}</p>`);
  }

  _getSpanElement(className, text) {
    return $(`<span class="${className}">${text}</span>`);
  }

  _renderItem(product) {
    this._renderItemMenuCart(product);
    this._renderItemPageCart(product);
  }

  _renderItemMenuCart(product) {
    const $container = this._getMainItemContainer('basket__card', product.id_product);

    const $img = this._getImageElement(product);
    $img.addClass('photo-product');

    const $productInfo = this._getDivElement("product-info");
    const $productName = this._getParagraphElement("product-name for-cart-menu", product.product_name);
    const $productRating = this._getProductRatingElement();
    $productRating.addClass('for-cart-menu');
    const $total = this._getDivElement("basket__product-total");
    $total
      .append(this._getSpanElement("product-quantity", product.quantity))
      .append(`<span> x </span>`)
      .append(this._getSpanElement("product-price", `&#36;${product.price}`));

    $productInfo
      .append($productName)
      .append($productRating)
      .append($total);

    const $deleteBtn = this._getDivElement("fas fa-times-circle delete-product");

    $container
      .append($img)
      .append($productInfo)
      .append($deleteBtn)
      .appendTo($('.cart-items-wrap'));
  }

  _renderItemPageCart(product) {
    const $container = this._getMainItemContainer('cart-table-row', product.id_product);

    const $productDetails = this._getDivElement('product-details cart-table-cell');
    const $img = this._getImageElement(product);

    const $productDescription = this._getDivElement('product-details-description');
    $productDescription
      .append(this._getParagraphElement("product-name", product.product_name))
      .append(this._getProductRatingElement())
      .append(this._getParagraphElement("product-details-properties", "Color:")
        .append(this._getSpanElement("product-details-value", product.color)))
      .append(this._getParagraphElement("product-details-properties", "Size:")
        .append(this._getSpanElement("product-details-value", product.size)));

    $productDetails
      .append($img)
      .append($productDescription);

    $container
      .append($productDetails)
      .append(this._getDivElement('cart-table-cell product-price', `&#36;${product.price}`))
      .append(this._getDivElement('cart-table-cell')
        .append($('<input class="cart-table-quantity" value="2" type="number" name="quantity">').val(product.quantity)))
      .append(this._getDivElement('cart-table-cell', product.shipping))
      .append(this._getDivElement('cart-table-cell product-sum', `&#36;${product.quantity * product.price}`))
      .append(this._getDivElement('cart-table-cell')
        .append('<i class="fas fa-times-circle cart-table-close-icon delete-product"></i>'))
      .appendTo($('.cart-table'));
  }

  _renderSum() {
    $('.cart-quantity').text(this.countGoods);
    $('.cart-total-sum').text(`$${this.amount}`);
  }

  _updateCart(product) {
    let $container = $(`div[data-product="${product.id_product}"]`);
    $container.find('.product-quantity').text(product.quantity);
    $container.find('.product-price').text(`$${product.quantity * product.price}`);
  }

  _getCartItem(id) {
    return this.cartItems.find(product => product.id_product === id);
  }

  _showCartProducts() {
    $('.basket-menu').removeClass('hidden').mouseleave(() => this._hideCartProducts());
  }

  _hideCartProducts() {
    $('.basket-menu').addClass('hidden');
  }

  addProduct(element) {
    const $productContainer = $(element).closest('.product-card');
    const $img = $productContainer.find('.product-img')[0];
    let productId = +$productContainer.data('id');
    let find = this._getCartItem(productId);
    if (find) {
      this._changeQuantity(find, 1);
    } else {
      let product = {
        id_product: productId,
        product_name: $productContainer.data('name'),
        price: $productContainer.data('price'),
        quantity: 1,
        img_src: $img.src,
        img_alt: $img.alt,
        color: $productContainer.data('color'),
        size: $productContainer.data('size')
      };
      this.cartItems.push(product);
      this._renderItem(product);
      this.amount += product.price;
      this.countGoods += product.quantity;
    }
    this._renderSum();
  }

  _getEventProductId(evt) {
    return $(evt.target).closest('.basket__card').data('product');
  }

  _onChangeQuantity(evt, quantity = 1, deleteItem = false) {
    let find = this._getCartItem(this._getEventProductId(evt));
    this._changeQuantity(find, deleteItem ? -find.quantity : quantity);
  }

  _changeQuantity(cartItem, quantity) {
    cartItem.quantity += quantity;
    this.countGoods += quantity;
    this.amount += cartItem.price * quantity;
    if (cartItem.quantity === 0) {
      this._remove(cartItem.id_product)
    } else {
      this._updateCart(cartItem);
    }
    this._renderSum();
  }

  _remove(id) {
    let find = this._getCartItem(id);
    this.cartItems.splice(this.cartItems.indexOf(find), 1);
    let $container = $(`div[data-product="${id}"]`);
    $container.remove();
  }
}