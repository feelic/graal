'use strict';

var util = require('../util/util.js');

var Modal = function (ui, parameters){
  this.ui = ui;
  this.body = document.body;

  this.type = 'alert';
  this.choices = [];
  this.image = 'src/images/illustrations/default_modal_illus.jpg';
  this.acceptCallback = function() {};

  for (var key in parameters) {
    this[key] = parameters[key];
  }

};

/*
 *
 */
 Modal.prototype.render = function() {
  var m = '<div class="modal">';
    m += this.renderTitle();
    m += this.renderImage();
    m += this.renderMessage();
    m += this.renderChoices();
    m += '</div>';
  return m;
};

Modal.prototype.renderTitle = function() {
  if (!this.title) {
    return '';
  }
  var t = '<div class="modal_title">';
    t += this.title;
    t += '</div>';
  return t;
};

Modal.prototype.renderImage = function() {
  var t = '<div class="modal_image" ';
    t += 'style="background-image:url(\'' + this.image + '\');"';
    t += '> </div>';
  return t;
};

Modal.prototype.renderMessage = function() {
  if (!this.message) {
    return '';
  }
  var t = '<div class="modal_message">';
    t += this.message;
    t += '</div>';
  return t;
};

Modal.prototype.renderChoices = function() {
  var c = '<div class="modal_choices">';
  if (this.choices.length > 0) {
    for (var i = 0; i < this.choices.length; i++) {
      if (this.choices[i].title) {
        this.choices[i].id = util.camelize(this.choices[i].title);
        c += '<button class="' + this.choices[i].id + ' btn">' + this.choices[i].title + '</button>';
      }
    }

  } else {
    c += '<button class="accept btn">OK</button> ';
  }
  return c;
};

Modal.prototype.open = function () {
  this.element = document.createElement('div');
  this.element.setAttribute('class', 'modal_overlay');
  if (this.background) {
    this.element.style.backgroundImage = 'url("' + this.background + '")';
  }
  this.element.innerHTML = this.render();
  this.body.appendChild(this.element);

  this.attachEvents();
};

Modal.prototype.close = function () {
  this.element.parentNode.removeChild(this.element);
};

Modal.prototype.attachEvents = function () {
  var accept = this.element.getElementsByClassName('accept')[0];
  if (accept) {
    accept.addEventListener('click', this.callBackWrapper.bind(this, this.acceptCallback));
  }
  var decline = this.element.getElementsByClassName('decline')[0];
  if (decline) {
    decline.addEventListener('click', this.callBackWrapper.bind(this, this.declineCallback));
  }

  if (this.type === 'choice') {
    for (var i = 0; i < this.choices.length; i++) {
      var c = this.choices[i];
      var btn = this.element.getElementsByClassName(c.id)[0];

      btn.addEventListener('click', this.callBackWrapper.bind(this, c.callback.bind(c.callbackContext)));
    }
  }
};

Modal.prototype.callBackWrapper = function (fn) {
  fn();
  this.close();
  this.ui.removeModal(this);
};


module.exports = Modal;
