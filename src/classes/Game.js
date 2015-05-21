'use strict';

var UserInterface = require('./UserInterface.js');
var Data = require('./Data.js');
var Knight = require('./Knight.js');

var Game = function() {
  this.ui = new UserInterface(this);

  this.data = new Data();

  this.init = function() {
    this.ui.initGameLayout();

    //dev setup
    //this.ui.renderMainMenu();
    this.newGame();
  };

  this.newGame = function() {
    this.ui.initMap();
    this.ui.renderGamePanel();

    this.knights = [];
    this.mana = 0;

    this.addKnight();
    this.addKnight(1);
  };

  this.addKnight = function(id) {
    if (!id) {
      id = 0;
    }

    var k = new Knight(this.data.knights[id]);
    this.knights.push(k);

    this.ui.renderGamePanel();

    return;
  };
};

module.exports = Game;
