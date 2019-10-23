/*jshint esversion: 9, strict: true, node: true */

(function() {
  'use strict';
  /**
   * Build Json to template
   *
   * @param {Object} data - Object to be build
   * @returns {Object} Builded JSON
   * @module buildJson
   */
  function buildJson(data) {
    data = Object.keys(data).map(function(key, index) {
      let obj = {
        'name': fixJson(key),
        'label': key.toUpperCase(),
        'value': data[key],
        'order': index
      };
      return obj;
    });
    return data;
  }

  /**
   * Normalize JSON
   *
   * @param {string} str - String to be normalized
   * @returns {string} Normalized string
   */
  function fixJson(str) {
    return str.normalize('NFD')
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, '-')
      .toLowerCase();
  }

  /**
   * Constructs an object from a array, using even indexes as key and odd indices as value
   *
   * @param {Array} array - Array to be transformed
   * @returns {Object}
   * @module toObject
   */
  function toObject(array) {
    let r = {};

    for (let i = 0; i < array.length; i += 2) {
      let key = (array[i]),
        value = array[i + 1];
      r[key] = value;
    }
    return buildJson(r);
  }

  function matrix(a) {
    let r = [];
    for (let i = 0; i < a.length; i++) {
      for (let z = 0; z < a[i].length; z++) {
        r.push(a[i][z]);
      }
    }
    return buildJson(r);
  }

  module.exports = {
    buildJson,
  };

}());
