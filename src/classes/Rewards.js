'use strict';

var Rewards = function (game) {
  this.game = game;
  this.territories = this.game.ui.map.territories;
};

Rewards.prototype.graalsearch = function graalsearch (placeId, difficulty) {
  var exploration = Math.floor(Math.random() * 5) * difficulty + 5;
  var territory = this.territories[placeId];

  territory.explored = territory.explored + exploration < 100 ? territory.explored + exploration : 100;

  return exploration + '% more explored';
};

module.exports = Rewards;
