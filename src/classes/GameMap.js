'use strict';

var d3 = require('d3');

var GameMap = function (game){

  var game = game;
  var strokeColors = ['#AAA', '#999', '#888', '#777', '#666', '#555', '#444', '#333', '#222', '#111', '#000'];

  this.territories = [];

  /*
   *
   */
  this.render = function() {

    d3.xml('./src/maps/britain.svg', this.initMap.bind(this));

  };

  this.initMap = function(error, documentFragment) {
    if (error) {
      console.log(error);
      return;
    }

    var svgNode = documentFragment.getElementsByTagName('svg')[0];
    d3.select('#map').node().appendChild(svgNode);
    d3.select('svg')
      .style('height', 600)
      .style('width', 1000);

    this.generateTerritoryList(svgNode.getElementById('territories').children);

    this.addEvents();
  };

  /*
   *
   */
  this.generateTerritoryList = function(territories) {
    for (var i = 0; i < territories.length; i++) {
      var id = territories[i].getAttribute('id');
      var t = {
        'id': id,
        'explored': 0,
        'element': d3.select('#' + id),
        'defaultFill': d3.select('#' + id).attr('fill'),
        'defaultStroke': '#FFF'
      };
      this.territories.push(t);
    }
  };

  /*
   *
   */
  this.addEvents = function() {
    for (var i = 0; i < this.territories.length; i++) {
      this.territories[i].element
        .on('mouseover', this.mouseInTerritory)
        .on('mouseout', this.mouseOutTerritory)
        .on('click', this.clickTerritory.bind(this.territories[i]));
    }
  };

  this.mouseInTerritory = function(d, i) {
    d3.select(this)
      .transition()
        .duration('200')
        .style('stroke', strokeColors[game.mana + 2]); //

  };

  this.mouseOutTerritory = function(d, i) {
    d3.select(this)
      .transition()
        .duration('300')
        .style('stroke', strokeColors[game.mana]); //

  };
  this.clickTerritory = function(d, i) {
    return this.id;
  };
};

module.exports = GameMap;
