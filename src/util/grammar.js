'use strict';

var grammar = {};

var filters = {
  'cap': function cap (text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  },
  'uppercase': function fullCaps (text) {
      return text.toUpperCase();
  },
  'lowercase': function lowercase (text) {
      return text.toLowerCase();
  }
};

var getPlaceholdersFromTemplate = function (text) {
  if (!text) {
    return [];
  }

  var placeholders = [];
  var re = new RegExp('[{].*?[}]', 'gi');
  var matches = text.match(re);

  if (matches === null) {
    return [];
  }

  for (var i = 0; i < matches.length; i += 1) {
    placeholders.push(matches[i].substring(0, matches[i].length - 1).substring(1));
  }

  return placeholders;
};

var interpretPlaceholders = function (placeholder, data) {
  var map = placeholder.split('$');
  var id = map[1] % data[map[0]].length;
  var text = data[map[0]][id][map[2]];

  if (map[3]) {
    text = filters[map[3]](text);
  }

  return text;
};

grammar.processGrammarTemplate = function (text, data) {
  if (!text) {
    return '';
  }

  var placeholders = getPlaceholdersFromTemplate(text);

  for (var i = 0; i < placeholders.length; i += 1) {
    text = text.replace('{' + placeholders[i] + '}', interpretPlaceholders(placeholders[i], data));
  }

  return text;
};

grammar.stringifyList = function (array, key) {
  var list = '';

  if (array.length === 1) {
    return array[0][key];
  }

  for (var i = 0, len = array.length; i < len; i += 1) {
    if (i === len - 1) {
      list += 'and ' + array[i][key];
    } else if (i === len - 2) {
      list += array[i][key] + ' ';
    } else {
      list += array[i][key] + ', ';
    }
  }

  return list;
};

module.exports = grammar;
