'use strict';

var d3 = require('d3');
var mapData = require('../maps/britain.js');
var util = require('../util/util.js');

var GameMap = function (game){

  this.game = game;
  this.strokeColors = ['#AAA', '#999', '#888', '#777', '#666', '#555', '#444', '#333', '#222', '#111', '#000'];

  this.territories = mapData;
};

/*
 *
 */
GameMap.prototype.render = function() {

  d3.xml('./src/maps/britain.svg', this.initMap.bind(this));

};

GameMap.prototype.initMap = function(error, documentFragment) {
  if (error) {
    console.log(error);
    return;
  }

  var svgNode = documentFragment.getElementsByTagName('svg')[0];
  d3.select('#map').node().appendChild(svgNode);
  d3.select('svg')
    .style('height', 530)
    .style('width', 900);

  this.generateTerritoryList(svgNode.getElementById('territories').children);

  this.addEvents();
};

/*
 *
 */
GameMap.prototype.generateTerritoryList = function(territories) {
  for (var i = 0; i < territories.length; i++) {
    var id = territories[i].getAttribute('id');
      this.territories[id].explored = 0;
      this.territories[id].element = d3.select('#' + id);
      this.territories[id].defaultFill = d3.select('#' + id).attr('fill');
      this.territories[id].defaultStroke = '#FFF';
      this.territories[id].graal = false;
  }

  this.hideGraal();
};

/*
 *
 */
GameMap.prototype.hideGraal = function() {
  var id = util.randomFromObject(this.territories);

  this.territories[id].graal = true;
};

/*
 *
 */
GameMap.prototype.addEvents = function() {
  for (var key in this.territories) {
    this.territories[key].element
      .on('mouseover', this.mouseInTerritory.bind(this, this.territories[key]))
      .on('mouseout', this.mouseOutTerritory.bind(this, this.territories[key]))
      .on('click', this.clickTerritory.bind(this, this.territories[key]));
  }
};

GameMap.prototype.mouseInTerritory = function(territory) {
  if (!territory.selected) {
    this.hoverTerritoryAnimation.call(territory.element[0][0], this);
  }
};

GameMap.prototype.mouseOutTerritory = function(territory) {
  if (!territory.selected) {
    this.deselectTerritoryAnimation.call(territory.element[0][0], this);
  }
};

GameMap.prototype.clickTerritory = function(territory) {
  for (var key in this.territories) {
    if (this.territories[key].selected) {
      this.territories[key].selected = false;
      this.deselectTerritoryAnimation.call(this.territories[key].element[0][0], this);
    }
  }
  territory.selected = true;

  this.selectTerritoryAnimation.call(territory.element[0][0], this);

  this.game.ui.territoryPanel.html(this.renderTerritoryPanel.call(territory));

};

GameMap.prototype.hoverTerritoryAnimation = function(map) {
  d3.select(this)
    .transition()
      .duration('200')
      .style('stroke', map.strokeColors[map.game.mana + 4]);
};

GameMap.prototype.selectTerritoryAnimation = function(map) {
  d3.select(this)
    .transition()
      .duration('200')
      .style('stroke', map.strokeColors[map.game.mana + 8]);
};

GameMap.prototype.deselectTerritoryAnimation = function(map) {
  d3.select(this)
    .transition()
      .duration('300')
      .style('stroke', map.strokeColors[map.game.mana]);
};

GameMap.prototype.renderTerritoryPanel = function () {
  var t = '<div>';
    t += '<h2>' + this.name + '</h2>';
    t += '<p title="Exploration increases your chances of finding the Graal if it is in this territory">' + this.explored + '% explored</p>';
    t += '<ul class="questList">';
    for (var i = 0; i < this.quests.length; i++) {
      if (!this.quests[i].done && !this.quests[i].inProgress) {
        t += '<li>';
        t += this.quests[i].displayOffer();
        t += '</li>';
      }
    }
    t += '</ul>';
    t += '</div>';
  return t;
};

module.exports = GameMap;
