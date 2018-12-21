"use strict";

/**
 * Объект списка продуктов
 */
const products = {
  productsArray: [],

  /**
   * Получает товары "с сервера"
   */
  getProducts() {
    for (let i = 0; i <= 20; i++) {
      const product = {
        id: i,
        imagePath: `img/products/product${i}.jpg`,
        alt: `product${i}`,
        name: `Товар ${i}`,
        price: (i) * 1000,
      };

      this.productsArray.push(product);
    }
  },

  /**
   * Выводит товары на страницу
   */
  showProducts() {
    this.productsArray.forEach(product => this.createProductsCards(product))
  },

  /**
   * Создает элемент продукта на странице
   * @param {object} product - объект товара для вывода на страницу
   */
  createProductsCards(product) {

  },

  getProductById(productId) {
    return this.productsArray.find(element => element.id === +productId);
  }
};

products.getProducts();
products.showProducts();


const onBuyProduct = function (evt) {
  if (!evt.target.classList.contains('product-card-hover')) {
    return;
  }
  const productCardElement = evt.target.parentElement.parentElement.parentElement;
  const id = productCardElement.dataset.id;

  basket.addProduct(products.productsArray[id]);
};

const productsElement = document.querySelector('.products');
productsElement.addEventListener('click', evt => onBuyProduct(evt));

