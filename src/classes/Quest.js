'use strict';

var util = require('../util/util.js');
var grammar = require('../util/grammar.js');

var Quest = function (game, place, difficulty, objectiveId) {

  this.game = game;
  this.place = place;
  this.place.quests.push(this);
  this.id = this.game.quests.length;
  this.game.quests.push(this);
  this.difficulty = difficulty;

  if (objectiveId) {
    this.objective = this.game.data.quests.objectives[objectiveId];
  } else {
    this.objective = this.makeRandomQuest();
  }

  this.adventures = [];
  this.makeRandomAdventures();
};

Quest.prototype.makeRandomQuest = function makeRandomQuest () {
  var r = util.randomFromObject(this.game.data.quests.objectives);

  if (r === 'graal') {
    return this.makeRandomQuest();
  }

  return this.game.data.quests.objectives[r];
};

Quest.prototype.makeRandomAdventures = function () {
  for (var i = 0; i < this.difficulty + 1; i++ ) {
    var r = Math.floor(Math.random() * this.game.data.quests.adventures.length);
    this.adventures.push(this.game.data.quests.adventures[r]);
  }
  this.adventures.push(this.objective);
};

Quest.prototype.startQuest = function (knights) {
  this.knights = knights;
  this.getGrammarData();
  this.adventurePointer = -1;
  this.inProgress = true;
  this.play();
};

Quest.prototype.play = function play () {
  this.timer = {};
  this.adventurePointer = this.adventurePointer + 1;

  var timeout = Math.random() * 1000 * 5;

  this.timer = setTimeout(function () {
    if (this.adventures[this.adventurePointer]) {
      this.playNextAdventure();
    } else {
      this.winQuest();
    }
  }.bind(this), timeout);
};

Quest.prototype.playNextAdventure = function () {
  var adventure = this.adventures[this.adventurePointer];
  var intro = grammar.processGrammarTemplate(adventure.intro[Math.floor(Math.random() * adventure.intro.length)], this.grammarData);
  var choices = [];

  for (var i = 0; i < adventure.choices.length; i += 1) {
    choices.push(this.formatAdventureChoice(adventure.choices[i]));
  }

  this.game.ui.openModal({
    'type': 'choice',
    'image': 'src/images/illustrations/main_menu.jpg',
    'message': intro,
    'choices': choices
  });
};

Quest.prototype.formatAdventureChoice = function (choice) {
  var formattedChoice = {
    'title': choice.title,
    'callback': this.chooseAdventurePath(choice),
    'callbackContext': this
  };

  return formattedChoice;
};

Quest.prototype.chooseAdventurePath = function (choice) {
  var adventurePathCallback = function () {
    var message = '';
    var okbtn = '';
    var callback = function () {};
    var testRoll = Math.floor(Math.random() * 100);

    if (this[choice.test] && this[choice.test]() || testRoll > choice.test) {
      // Success !
      message = grammar.processGrammarTemplate(util.randomFromArray(choice.completionSuccess), this.grammarData);
      okbtn = util.randomFromArray(this.game.data.messages.success);
      callback = this.play;
    } else {
      // Failure :/
      message = grammar.processGrammarTemplate(util.randomFromArray(choice.completionFailure), this.grammarData);
      okbtn = util.randomFromArray(this.game.data.messages.failure);
      callback = this.failQuest;
    }

    this.game.ui.openModal({
      'type': 'choice',
      'image': 'src/images/illustrations/main_menu.jpg',
      'message': message,
      'choices': [
        {
          'title': okbtn,
          'callback': callback,
          'callbackContext': this
        }
      ]
    });
  };

  return adventurePathCallback;
};

Quest.prototype.winQuest = function () {
  this.success = true;
  this.setReward();
  this.endQuest();
};

Quest.prototype.failQuest = function () {
  this.success = false;
  this.endQuest();
};

Quest.prototype.endQuest = function () {
  var okbtn = this.success ? util.randomFromArray(this.game.data.messages.success) : util.randomFromArray(this.game.data.messages.failure);
  var message = 'The Knights, ' + grammar.stringifyList(this.knights, 'name') + ' return ';
    message += this.success ? 'wreathed in glory' : 'defeated';
    message += ' from their quest';

  message += '<p>';
  for (var i = 0; i < this.knights.length; i++) {
    message += this.knights[i].renderPortrait();
  }
  message += '</p>';

  if (this.rewardText) {
    message += '<br/>They bring treasure back with them:';
    message += this.rewardText;
  }

  this.game.ui.openModal({
    'type': 'choice',
    'image': 'src/images/illustrations/main_menu.jpg',
    'message': message,
    'choices': [
      {
        'title': okbtn,
        'callback': this.endQuestCallback,
        'callbackContext': this
      }
    ]
  });

  this.done = true;
  this.inProgress = false;
};

Quest.prototype.endQuestCallback = function () {
  for (var i = 0; i < this.knights.length; i++) {
    this.knights[i].busy = false;
  }

  var newQuestType = this.objective.id === 'graal' ? 'graal' : false;

  this.game.addQuest(this.place, newQuestType, false);
};

Quest.prototype.setReward = function () {
  this.rewardText = '<ul>';
  for (var i = 0; i < this.objective.reward.length; i += 1) {
    this.rewardText += '<li>' + this.game.rewards[this.objective.reward[i]](this.place.id, this.difficulty) + '</li>';
  }
  this.rewardText += '</ul>';
};

Quest.prototype.findGraal = function () {
  if (!this.place.graal) {
    return false;
  }
  var chance = 100 - (2 + this.place.explored);
  var testRoll = Math.floor(Math.random() * 100);

  return testRoll > chance;
};

Quest.prototype.displayOffer = function () {
  var p = '<div class="questOffer">';
    p += this.objective.title;
    p += '<span class="difficulty" title="difficulty: ' + this.difficulty + '">';
    for (var i = 0; i < this.difficulty; i++) {
      p += ' &#9733;';
    }
    p += '</span>';
    p += '<button class="btn btn-action questLink" data-questid="' + this.id + '">-></button>';
    p += '</div>';
  return p;
};

Quest.prototype.openInterface = function () {
  if (this.done) {
      this.game.ui.questPanel.html('this quest is done');
  } else {
      this.game.ui.questPanel.html(this.renderPlanningInterface());
  }

  this.game.ui.questPanel.show();
  this.game.ui.mapPanel.hide();
  return this;
};

Quest.prototype.renderPlanningInterface = function () {
  var p = '<div class="planningInterface">';
    p += this.renderInterfaceHeader();

    p += this.game.ui.renderKnightPicker();

    p += this.renderCloseButton();
    p += ' ';
    p += this.renderStartButton();

    p += '</div>';
  return p;
};

Quest.prototype.renderInterfaceHeader = function () {
  var p = '';
    p += '<h1>' + this.objective.title + '</h1>';
    p += '<h2>In ' + this.place.name + '</h2>';
    p += '<p>Difficulty :';
    p += '<span class="difficulty" title="difficulty: ' + this.difficulty + '">';
    for (var i = 0; i < this.difficulty; i++) {
      p += ' &#9733;';
    }
    p += '</span>';
    p += '</p>';

  return p;
};

Quest.prototype.renderCloseButton = function () {
  return '<button class="btn btn-action closeQuestLink"><-</button>';
};

Quest.prototype.renderStartButton = function renderStartButton () {
  return '<button class="btn startQuestLink">Onwards !</button>';
};

Quest.prototype.getGrammarData = function () {
  this.grammarData = {
    'k': []
  };

  for (var i = 0; i < this.knights.length; i += 1) {
    var knight = this.knights[i];
    var pronouns = {
      'name': knight.name,
      'fullName': knight.fullName || knight.name,
      'nickName': knight.nickName || knight.name,
      'they': knight.gender === 'm' ? 'he' : 'she',
      'them': knight.gender === 'm' ? 'him' : 'her',
      'themselves': knight.gender === 'm' ? 'himself' : 'herself',
      'their': knight.gender === 'm' ? 'his' : 'her',
      'theirs': knight.gender === 'm' ? 'his' : 'hers'
     };

    this.grammarData.k.push(pronouns);
  }
};

module.exports = Quest;
