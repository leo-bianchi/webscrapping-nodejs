/*jshint esversion: 9, strict: true, node: true */

(function() {
  'use strict';
  /**
   * Build Json to template
   *
   * @param {Object} _data - Object to be build
   * @returns {Object} Builded JSON
   * @module buildJson
   */
  function buildJson(_data) {
    _data = Object.keys(_data).map(function(key, index) {
      let obj = {
        'name': fixJson(key),
        'label': key.toUpperCase(),
        'value': _data[key],
        'order': index
      };
      return obj;
    });
    return _data;
  }

  /**
   * Normalize JSON
   *
   * @param {string} _str - String to be normalized
   * @returns {string} Normalized string
   */
  function fixJson(_str) {
    return _str.normalize('NFD')
      .replace(/\uFFFD/g, '')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^A-Za-z0-9+ ]/g, '')
      .replace(/\s+/g, '-')
      .toLowerCase();
  }

  /**
   * Constructs an object from a array, using even indexes as key and odd indices as value
   *
   * @param {Array} _array - Array to be transformed
   * @returns {Object}
   */
  function toObject(_array) {
    let r = {};

    for (let i = 0; i < _array.length; i += 2) {
      let key = (_array[i]),
        value = _array[i + 1];
      r[key] = value;
    }
    return buildJson(r);
  }

  /**
   * Constructs an object from a bidimensional array, using even indexes as key and odd indices as value
   *
   * @param {Array.<Array>} _a - Array to be transformed
   * @returns {Object}
   */
  function matrixToObject(_a) {
    let r = [];
    for (let i = 0; i < _a.length; i++) {
      for (let z = 0; z < _a[i].length; z++) {
        r.push(_a[i][z]);
      }
    }
    return toObject(r);
  }

  module.exports = {
    toObject,
    matrixToObject,
  };

}());
