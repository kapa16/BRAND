/*jslint node: true */
"use strict";

/**
 * объект корзины
 */
const basket = {
  productsBasket: [],
  currentProduct: {
    count: 0,
    sum: 0
  },
  countProducts: 0,
  sumProducts: 0,
  basketContainerElement: document.querySelector('.basket-menu'),
  basketInfoElement: document.querySelector('.cart-quantity'),
  basketMenuListClass: '.basket__menu-list',
  basketCardClass: '.basket__card',
  basketPhotoProductClass: '.photo-product',
  basketProductInfoClass: '.product-info',
  basketProductTitleClass: '.product-name',
  basketForMenuClass: '.for-cart-menu',

  /**
   * Добавляет товар в корзину
   * @param {object} product - товар
   */
  addProduct(product) {
    this.currentProduct = this.findProductInBasket(product);
    if (!this.currentProduct) {
      this.addNewProductInBasket(product);
    } else {
      this.calcCountProduct(1);
    }
    this.showBasket();
  },

  /**
   * Увеличивает количество товара в корзине
   * @param {number} diff - разница для изменения количества товара
   */
  calcCountProduct(diff) {
    this.currentProduct.count += diff;
    this.currentProduct.sum = this.currentProduct.price * this.currentProduct.count;
  },

  /**
   * Добавляет новый товар в корзину
   * @param {object} product - товар
   */
  addNewProductInBasket(product) {
    this.currentProduct = Object.assign({}, product);
    this.currentProduct.count = 0;
    this.currentProduct.sum = 0;
    this.calcCountProduct(1);
    this.productsBasket.push(this.currentProduct);
  },

  /**
   * Проверяет наличие товара в корзине
   * @param {object} product - товар
   * @returns {object} - найденный товар
   */
  findProductInBasket(product) {
    return this.productsBasket.find(elem => elem.id === product.id);
  },

  /**
   * Отображает информацию по корзине
   */
  showBasket() {
    this.calcTotal();
    this.clearBasketOnPage();
    this.refreshBasketInfo();
    this.refreshCountProducts();
    this.productsBasket.forEach(product => this.addProductElement(product));
  },

  onClickBasket() {
    if (this.countProducts !== 0) {
      this.basketContainerElement.classList.toggle('hidden');
    }
  },

  /**
   * Считает общее количество и сумму товаров в корзине
   */
  calcTotal() {
    this.countProducts = this.productsBasket.reduce((accum, element) => accum + element.count, 0);
    this.sumProducts = this.productsBasket.reduce((accum, element) => accum + element.sum, 0);
  },

  /**
   * Удаляет содержимое корзины в HTML для вывода текущих товаров корзины
   */
  clearBasketOnPage() {
    this.basketContainerElement.innerHTML = '';
  },

  /**
   * Обновляет инофрмационное сообщение по содержимому корзины
   */
  refreshBasketInfo() {
    if (this.countProducts === 0) {
      this.basketInfoElement.textContent = 'Корзина пуста';
    } else {
      this.basketInfoElement.textContent = `Количество товаров в корзине: ${this.countProducts}, на сумму ${this.sumProducts}`;
    }
  },

  /**
   * Обновляет счетчик товаров в корзине
   */
  refreshCountProducts() {
    const countElement = this.basketContainerElement.querySelector('.basket__count-products');
    countElement.textContent = this.countProducts;
  },

  /**
   * Добавляет элемент продукта в корзину
   * @param {object} product - объект товара для вывода на страницу
   */
  addProductElement(product) {
    const productListItem = document.createElement('li');
    productListItem.classList.add(this.basketMenuListClass);
    this.basketContainerElement.appendChild(productListItem);

    const productCard = document.createElement('div');
    productCard.classList.add(this.basketCardClass);
    productCard.dataset.productId = product.id;
    productListItem.appendChild(productCard);

    const imageProduct = new Image();
    productCard.classList.add(this.basketPhotoProductClass);
    imageProduct.src = product.imagePath;
    imageProduct.alt = product.alt;
    productCard.appendChild(imageProduct);

    const productInfo = document.createElement('div');
    productInfo.classList.add(this.basketProductInfoClass);
    productCard.appendChild(productInfo);

    const titleProduct = document.createElement('p');
    titleProduct.classList.add(this.basketProductTitleClass);
    titleProduct.classList.add(this.basketForMenuClass);
    titleProduct.textContent = product.name;
    productInfo.appendChild(titleProduct);

    const priceProduct = document.createElement('div');
    priceProduct.classList.add('product-card__price');
    priceProduct.classList.add(this.basketForMenuClass);
    priceProduct.textContent = product.price;
    productInfo.appendChild(priceProduct);
  },

  /**
   * Удаляет товар из корзины
   * @param {Event} event - событие нажатия на кнопку
   */
  removeProduct(event) {
    const productId = +event.target.parentElement.dataset.productId;
    for (let i = 0; i < this.productsBasket.length; i++) {
      if (this.productsBasket[i].id === productId) {
        this.productsBasket.splice(i, 1);
        break;
      }
    }
    this.showBasket();
  }
};


basket.basketContainerElement.addEventListener('click', evt => basket.onClickBasket(evt));

