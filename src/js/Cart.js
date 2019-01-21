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
    $( this.container).mouseenter(() => this._showCartProducts());

    $(this.container).on('click', '.reduce-quantity', evt => this._onChangeQuantity(evt, -1));
    $(this.container).on('click', '.increase-quantity', evt => this._onChangeQuantity(evt, 1));
    $(this.container).on('click', '.delete-product', evt => this._onChangeQuantity(evt, 0, true));
  }

  _renderItem(product) {
    const $container = $('<div/>', {
      class: 'basket__card',
      'data-product': product.id_product
    });

    const $img = $('<img/>', {
      src: product.img_src,
      alt: product.img_alt,
      class: "photo-product"
    });
    $img.appendTo($container);

    const $productInfo = $('<div/>', {
      class: "product-info"
    });
    $productInfo.append($(`<p class="product-name for-cart-menu">${product.product_name}</p>`));

    const $productRating = $('<div/>', {
      class: "product-rating for-cart-menu"
    });
    for (let i = 0; i < 5; i++) {
      $productRating.append('<i class="fas fa-star rating-star"></i>');
    }


    // const $quantity = $('<div/>', {
    //   class: 'quantity-wrap'
    // });
    //
    // $quantity.append($(`<button class="btn-quantity reduce-quantity">-</button>`));
    // $quantity.append($(`<p class="product-quantity">${product.quantity}</p>`));
    // $quantity.append($(`<button class="btn-quantity increase-quantity">+</button>`));
    // $container.append($quantity);
    //
    // $container.append($(`<p class="product-price">${product.price} руб.</p>`));
    // $container.append($(`<button class="btn-quantity delete-product">X</button>`));
    // $container.appendTo($('.cart-items-wrap'));
  }

  _renderSum() {
    $('.sum-goods').text(`Всего товаров в корзине: ${this.countGoods}`);
    $('.sum-price').text(`Общая сумма: ${this.amount} руб.`);
  }

  _updateCart(product) {
    let $container = $(`div[data-product="${product.id_product}"]`);
    $container.find('.product-quantity').text(product.quantity);
    $container.find('.product-price').text(`${product.quantity * product.price} руб.`);
  }

  _getCartItem(id) {
    return this.cartItems.find(product => product.id_product === id);
  }

  _showCartProducts() {
    $('.basket-menu').removeClass('hidden').mouseleave(() => this._hideCartProducts());
  }
  _hideCartProducts(){
    $('.basket-menu').addClass('hidden');
  }

  addProduct(element) {
    const $productContainer = $(element).closest('product-card');
    const $img = $productContainer.find('.product-img');
    let productId = +$productContainer.data('id');
    let find = this._getCartItem(productId);
    if (find) {
      this._changeQuantity(find, 1);
    } else {
      let product = {
        id_product: productId,
        product_name: $(element).data('name'),
        price: +$(element).data('price'),
        quantity: 1,
        img_src: $img.src,
        img_alt: $img.alt
      };
      this.cartItems.push(product);
      this._renderItem(product);
      this.amount += product.price;
      this.countGoods += product.quantity;
    }
    this._renderSum();
  }

  _getEventProductId(evt) {
    return $(evt.target).closest('.cart-item').data('product');
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