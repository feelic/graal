'use strict';

var Modal = require('./Modal.js');
var GameMap = require('./GameMap.js');
var $ = require('jquery');

var UserInterface = function(game) {

  this.game = game;

  this.map = new GameMap(this.game);

  this.modals = [];

};

/*
 *
 */
UserInterface.prototype.renderMainMenu = function() {
  this.openModal({
    'type': 'choice',
    'background': 'src/images/illustrations/default_modal_illus.jpg',
    'image': 'src/images/illustrations/main_menu.jpg',
    'choices': [
      {
        'title': 'New Game',
        'callback': this.game.newGame,
        'callbackContext': this.game
      }
    ]
  });
};

/*
 *
 */
UserInterface.prototype.initGameLayout = function() {
  var l = '';
    l += '<div id="leftPanel">';
      l += '<div id="gamePanel"></div>';
      l += '<div id="blop"></div>';
    l += '</div>';
    l += '<div id="rightPanel">';
      l += '<div id="mapPanel">';
        l += '<div id="mapWrapper"><div id="map"></div></div>';
        l += '<div id="territoryPanel"></div>';
      l += '</div>';
      l += '<div id="questPanel"></div>';
    l += '</div>';

  $('body').html(l);

  this.gamePanel = $('#gamePanel');
  this.questPanel = $('#questPanel');
  this.mapPanel = $('#mapPanel');
  this.territoryPanel = $('#territoryPanel');

  this.attachEvents();
};

UserInterface.prototype.initMap = function () {
  this.map.render();
};

/*
 *
 */
 UserInterface.prototype.renderGamePanel = function() {
  var l = this.renderGameMenu();
    l += this.renderRoundTable();
  this.gamePanel.html(l);
};

/*
 *
 */
 UserInterface.prototype.renderGameMenu = function() {
  var m = '<div id="gameMenu">';
    m += '</div>';
  return m;
};

/*
 *
 */
 UserInterface.prototype.renderRoundTable = function() {
  var r = '<div id="roundTablePanel">';
    r += '<div id="roundTable">';
    r += '</div>';
  if (this.game.knights && this.game.knights.length) {
    for (var i = 0; i < this.game.knights.length; i++) {
      r += '<div class="roundTable_knight roundTable_knight' + i + '">';
      r += this.game.knights[i].renderPortrait();
      r += '<div class="roundTable_knightName">' + this.game.knights[i].name + '</div>';
      r += '</div>';
    }
  }

    r += '</div>';

  return r;
};

UserInterface.prototype.openModal = function(param) {
  this.modals.push(new Modal(this, param));
  this.modals[this.modals.length - 1].open();
};

UserInterface.prototype.removeModal = function (m) {
  var i = this.modals.indexOf(m);
  if (i > -1){
    this.modals.splice(i, 1);
  }
};

UserInterface.prototype.attachEvents = function () {
  $(document).on('click', '.questLink', this.clickQuestLink.bind(this));
  $(document).on('click', '.closeQuestLink', this.clickCloseQuestLink.bind(this));
  $(document).on('click', '.startQuestLink', this.clickStartQuestLink.bind(this));
  $(document).on('click', '.knightPickerInput.closed', this.displayKnightPickerChoices.bind(this.game));
  $(document).on('click', '.knightChoice', this.pickKnight.bind(this.game));
};

UserInterface.prototype.clickQuestLink = function () {
  var btn = $(arguments[0].currentTarget);

  this.openQuest = this.game.quests[btn.attr('data-questid')];
  this.openQuest.openInterface();
};

UserInterface.prototype.clickCloseQuestLink = function () {
  var game = this.game;
  $('.knightPickerInput').each(function(){
    if ($(this).attr('data-selectedknightid')) {
      game.getKnightById($(this).attr('data-selectedknightid')).busy = false;
    }
  });
  this.openQuest = null;
  this.questPanel.hide();
  this.mapPanel.show();
};

UserInterface.prototype.clickStartQuestLink = function () {
  var knights = this.getKnightsFromPicker();

  this.openQuest.startQuest(knights);
  this.openQuest = null;
  this.questPanel.hide();
  this.mapPanel.show();
};

UserInterface.prototype.renderKnightPicker = function () {
  var kp = '<div id="knightPicker">';
    for (var i = 0; i < 4; i++) {
      kp += '<div class="knightPickerInput closed" data-inputid="' + i + '" data-selectedknightid="">';
      kp += this.renderKnightPickerInput();
      kp += '</div>';
    }
    kp += '</div>';
  return kp;
};

UserInterface.prototype.renderKnightPickerInput = function (knight) {
  var kp = '';
    if (knight) {
      kp += knight.renderPortrait();
      kp += knight.name;
    } else {
      kp += '<div class="knightPortrait"></div>';
    }

  return kp;
};

UserInterface.prototype.displayKnightPickerChoices = function () {
  var box = $(arguments[0].currentTarget);
  var previousKnight = this.getKnightById(box.attr('data-selectedknightid'));
  if (previousKnight !== -1) {
    previousKnight.busy = false;
  }

  var c = '';
  for (var i = 0; i < this.knights.length; i++) {
    if (!this.knights[i].busy) {
      c += '<div class="knightChoice" data-knightid="' + this.knights[i].id + '">';
      c += this.knights[i].renderPortrait();
      c += this.knights[i].name;
      c += '</div>';
    }
  }
  c += '<div class="knightChoice" data-knightid="">';
  c += '<div class="knightPortrait"></div>';
  c += '</div>';
  box.html(c);
  box.addClass('open');
  box.removeClass('closed');
};

UserInterface.prototype.pickKnight = function () {
  var box = $(arguments[0].currentTarget).parent('.knightPickerInput');
  var id = $(arguments[0].currentTarget).attr('data-knightid');

  var knight = this.getKnightById(id);

  if (knight !== -1 && !knight.busy) {
    knight.busy = true;
    box.html(this.ui.renderKnightPickerInput(knight));
    box.attr('data-selectedknightid', id);
  } else {
    box.attr('data-selectedknightid', '');
    box.html(this.ui.renderKnightPickerInput());
  }
  box.removeClass('open');
  box.addClass('closed');
};
UserInterface.prototype.getKnightsFromPicker = function () {
  var knights = [];
  $('.knightPickerInput').each(function(){
    if ($(this).attr('data-selectedknightid')) {
      knights.push($(this).attr('data-selectedknightid'));
    }
  });
  for (var i = 0; i < knights.length; i++) {
    knights[i] = this.game.getKnightById(knights[i]);
  }
  return knights;
};
module.exports = UserInterface;
