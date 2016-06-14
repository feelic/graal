'use strict';

var Knight = function (data) {
  for (var key in data) {
    this[key] = data[key];
  }
};

Knight.prototype.renderPortrait = function () {
  var p = '<div class="knightPortrait">';
    p += '<img src="' + this.portrait + '"> ';
    p += '</div>';
  return p;
};

module.exports = Knight;
