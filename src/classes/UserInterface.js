'use strict';

var Modal = require('./Modal.js');
var GameMap = require('./GameMap.js');


var UserInterface = function(game) {

  this.game = game;

  this.map = new GameMap(this.game);

  this.body = document.body;
  this.modals= [];

  /*
   *
   */
  this.renderMainMenu = function() {
    this.openModal({
      'type': 'choice',
      'background': 'src/images/illustrations/default_modal_illus.jpg',
      'image': 'src/images/illustrations/main_menu.jpg',
      'choices':[
        {
          'title': 'New Game',
          'callback': this.game.newGame,
          'callbackContext' : this.game
        }
      ]
    });
  };

  /*
   *
   */
  this.initGameLayout = function() {
    var l = '<div id="gamePanel"></div>';
      l += '<div id="mapPanel"><div id="map"></div></div>';
    this.body.innerHTML = l;

    this.gamePanel = document.getElementById('gamePanel');
    this.mapPanel = document.getElementById('mapPanel');
  };

  this.initMap = function () {
    this.map.render();
  };

  /*
   *
   */
  this.renderGamePanel = function() {
    var l = this.renderGameMenu();
      l += this.renderRoundTable();
    this.gamePanel.innerHTML = l;
  };

  /*
   *
   */
  this.renderGameMenu = function() {
    var m = '<div id="gameMenu">';
      m += '</div>';
    return m;
  };

  /*
   *
   */
  this.renderRoundTable = function() {
    var r = '<div id="roundTablePanel">';
      r += '<div id="roundTable">';
      r += '</div>';
    if (game.knights && game.knights.length) {
      for (var i = 0; i < game.knights.length; i++) {
        r += '<div class="roundTable_knight' + i + '">';
        r += game.knights[i].renderPortrait();
        r += '</div>';
      }
    }

      r += '</div>';

    return r;
  };

  this.openModal = function(param) {
    this.modals.push(new Modal(this, param));
    this.modals[this.modals.length - 1].open();
  };

  this.removeModal = function (m) {
    var i = this.modals.indexOf(m);
    if (i > -1){
      this.modals.splice(i, 1);
    }
  };
};

module.exports = UserInterface;
