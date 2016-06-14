'use strict';

var util = {};

util.camelize = function (str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
    if (+match === 0) {
      return ''; // or if (/\s+/.test(match)) for white spaces
    }
    return index === 0 ? match.toLowerCase() : match.toUpperCase();
  });
};

util.randomFromArray = function (array) {
  return array[Math.floor(Math.random() * (array.length - 1))];
};

util.randomFromObject = function(obj) {
  var result;
  var count = 0;
  for (var prop in obj) {
    if (Math.random() < 1 / ++count) {
      result = prop;
    }
  }
  return result;
};

module.exports = util;
