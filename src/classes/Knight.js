'use strict';



var Knight = function (data) {
  for(var key in data) {
    this[key] = data[key];
  }

  this.renderPortrait = function () {
    var p = '<div class="knightPortrait">';
      p += '<img src="' + this.portrait + '">';
      p += '</div>';
    return p;
  }
};

module.exports = Knight;
