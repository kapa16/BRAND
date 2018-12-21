"use strict";

/**
 * Конструктор объекта для работы с запросами к серверу
 * @param {string} url - строка адреса для запроса
 * @constructor
 */
function ajaxRequest(url) {
  return new Promise(function(resolve, reject) {
    const fileUrl = url;
    const request = new XMLHttpRequest();

    request.responseType = "json";
    request.open('GET', fileUrl, true);
    /**
     * Проверяет статус запроса к сверверу и вызывет функцию callback
     */
    request.onload = function () {
      if (request.readyState !== 4) {
        return;
      }

      if (request.status !== 200) {
        reject(new Error(request.statusText));
      }

      resolve(request.response);
    }.bind(this);
    request.send();


  })
}
