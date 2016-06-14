'use strict';

var UserInterface = require('./UserInterface.js');
var Data = require('./Data.js');
var Knight = require('./Knight.js');
var Quest = require('./Quest.js');
var Rewards = require('./Rewards.js');

var Game = function() {
  this.ui = new UserInterface(this);

  this.data = new Data();
  this.rewards = new Rewards(this);

  this.ui.initGameLayout();

  //dev setup
  this.newGame();
  //real setup
  //this.ui.renderMainMenu();

};

Game.prototype.newGame = function() {
  this.ui.initMap();
  this.ui.renderGamePanel();

  this.knights = [];
  this.quests = [];
  this.mana = 0;

  this.addKnight(0);
  this.addKnight();
  this.addKnight();

  for (var key in this.ui.map.territories) {
    this.ui.map.territories[key].quests = [];
    this.addQuest(this.ui.map.territories[key], 'graal', 1);
    var r = Math.ceil(Math.random() * 2);
    for (var i = 0; i < r; i++) {
      this.addQuest(this.ui.map.territories[key]);
    }
  }

};

Game.prototype.addKnight = function(id) {
  if (!id && id !== 0) {
    id = Math.floor(Math.random() * this.data.knights.length);
  }

  var k = new Knight(this.data.knights[id]);
  this.knights.push(k);
  this.data.knights.splice(id, 1);

  this.ui.renderGamePanel();

  return;
};

Game.prototype.getKnightById = function(id) {
  if (id === '') {
    return -1;
  }
  for (var i = 0; i < this.knights.length; i++){
    if (this.knights[i].id === ~~id) {
      return this.knights[i];
    }
  }
  return -1;
};

Game.prototype.addQuest = function(place, type, difficulty) {
  if (!difficulty) {
    difficulty = Math.ceil(Math.random() * 3);
  }

  return new Quest(this, place, difficulty, type);
};

module.exports = Game;
