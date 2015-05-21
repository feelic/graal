'use strict';

var util = require('../util/util.js');

var Modal = function (ui, parameters){
  this.ui = ui;
  this.body = document.body;

  this.type = 'alert';
  this.choices = [];
  this.image = 'src/images/illustrations/default_modal_illus.jpg';
  this.acceptCallback = function() {};

  /*
   *
   */
  this.configure = function(param) {
    for (var key in param) {
      this[key] = param[key];
    }
  };
  this.configure(parameters);

  /*
   *
   */
  this.render = function() {
    var m = '<div class="modal">';
      m += this.renderTitle();
      m += this.renderImage();
      m += this.renderMessage();
      m += this.renderChoices();
      m += '</div>';
    return m;
  };

  this.renderTitle = function() {
    if (!this.title) {
      return '';
    }
    var t = '<div class="modal_title">';
      t += this.title;
      t += '</div>';
    return t;
  };

  this.renderImage = function() {
    var t = '<div class="modal_image" ';
      t += 'style="background-image:url(\'' + this.image + '\');"';
      t += '> </div>';
    return t;
  };

  this.renderMessage = function() {
    if (!this.message) {
      return '';
    }
    var t = '<div class="modal_message">';
      t += this.message;
      t += '</div>';
    return t;
  };

  this.renderChoices = function() {
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

  this.open = function () {
    this.element = document.createElement('div');
    this.element.setAttribute('class', 'modal_overlay');
    if (this.background) {
      this.element.style.backgroundImage = 'url("' + this.background + '")';
    }
    this.element.innerHTML = this.render();
    this.body.appendChild(this.element);

    this.attachEvents();
  };

  this.close = function () {
    this.element.parentNode.removeChild(this.element);
  };

  this.attachEvents = function () {
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

  this.callBackWrapper = function (fn) {
    fn();
    this.close();
    this.ui.removeModal(this);
  };

};
module.exports = Modal;
