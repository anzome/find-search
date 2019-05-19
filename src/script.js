/**

TODO
- hightlight text in input when focusing on it
- block posibility to remove current text in the input by next pushing hotkey
- show nice message if there is no search inputs
- change event onkeyup on a something else
- add signals about situations when plugin does not «true» find


*/

//declare vars for future assignment into functions
(function($) {
'use strict';
var inputs = [];
var searchInputs = [];
var backupInputs = [];
var searchAmount = 0;
var nextInput = 0;

function init() {
  inputs = document.getElementsByTagName('input');
  toggleMousetrap(document.activeElement);
  if (inputs.length === 0) {
    return false;
  } else {
    getSearchInputs(inputs);
    if (searchInputs.length === 0 && backupInputs.length > 0) {
      searchInputs = backupInputs;
    }

    searchAmount = searchInputs.length;
  };
}

function toggleMousetrap(element) {
  if (element.tagName.toLowerCase() === 'input') {
    var mouseRegExp = / mousetrap/i;

    if (mouseRegExp.test(element.className)) {
      element.className.replace(mouseRegExp, '');
    } else {
      element.setAttribute('class', element.className + ' mousetrap');
    };
  };
}

function getSearchInputs(inputs) {
  var preliminaryList = [];

  for (var i = 0, input, len = inputs.length; i < len; i++) {
    input = inputs[i];
    if (minCheck(input)) {
      //element meets the minimal criteria
      preliminaryList.push(input);
    };
  }

    //what if we have several inputs that passing minimal check?
  if (preliminaryList.length > 0) {
    for (var i = 0, input, len = preliminaryList.length; i < len; i++) {
      input = preliminaryList[i];
      if (check(input)) {
        searchInputs.push(input);
      }
    }

    if (searchInputs.length === 0) {
      for (var i = 0, input; i < preliminaryList.length; i++) {
        backupInputs.push(preliminaryList[i]);
      }
    }
  }
}

function nodeParents(node) {
    var list = [];

    //recursion returns all parents
    function getParent(node) {
      var parent = node.parentNode;
      if (parent.tagName.toLowerCase() !== ('body' || 'html')) {
        list.push(parent);
        getParent(parent);
      };
    };

    getParent(node);
    return list;
}

function minCheck(entity) {
  // if we got not text input elements
  var inputType = entity.type.toLowerCase();

  // only visible and enebled fields are allowed
  if ((inputType === 'text' || inputType === 'search') && !$(entity).is(':hidden') && !$(entity).is(':disabled')) {
      return true;
  } else {
      return false;
  }
}

function check(entity) {
    //makes full list of elements that we want to check (input itself and parents)
    // var ones = entity.parents;
    // ones.unshift(entity);
    //checks everyone element in our list
    var findSearch = /search/i;
    var findNav = /nav/i;
    var findQ = /^q$/i;

    var checkRules = function(one, parent) {
      // this element is parent?
      if (typeof parent === 'undefined' || parent !== true) {
        parent = false;
      }

      if (!parent) {
        // if we check input
        if (one.type.toLowerCase() === 'search') {
          return true;
        } else if (findQ.test(one.id) || findSearch.test(one.id)) {
          return true;
        } else if (findSearch.test(one.name)) {
          return true;
        } else if (findSearch.test(one.className)) {
          return true;
        } else if (findSearch.test(one.placeholder)) {
          return true;
        }
      } else {
          // if we check one of input's parents
        if (findNav.test(one.id)) {
          return true;
        } else if (findNav.test(one.name)) {
          return true;
        } else if (findNav.test(one.className)) {
          return true;
        } else if (findNav.test(one.action) || findQ.test(one.action)) {
          return true;
        }
      }

      // if no one condition didn't work
      return false;
    };

    var checkParents = function(node) {
      var parent = node.parentNode;
      var parentName = parent.tagName.toLowerCase();

      if (parentName !== ('body' || 'html')) {
        if (checkRules(node, true)) {
          return true;
        }

        checkParents(parent);
      }

      // parents are bad too
      return false;
    };

    if (checkRules(entity)) {
      return true;
    } else {
      return checkParents(entity);
    }

    //if no item fits
    return false;
}

function searchFocus() {
    if (nextInput > searchAmount - 1) {
      nextInput = 0;
    }

    if (searchInputs[nextInput]) {
      //remove class mousetrap from input
      toggleMousetrap(document.activeElement);
      searchInputs[nextInput].focus();

      //add class mousetrap on the new input
      toggleMousetrap(searchInputs[nextInput]);
      nextInput++;
    } else {
      //TODO: here must be exceprtion handler
    }
}

// The jQuery implementention of ready event is common and works across all browsers.
$(document).ready(function() {
  init();
  if (searchInputs.length > 0) {
    //see mousetrap lib at http://craig.is/killing/mice
    Mousetrap.bind('ctrl+i', function(e, combo) {
      searchFocus();
    });
  }

  if (searchInputs.length > 0 && searchInputs !== backupInputs) {
    chrome.extension.sendMessage({ga_category: 'good', ga_action:'find search', ga_label: document.URL }, function(response) {});
  } else if (backupInputs.length > 0) {
    chrome.extension.sendMessage({ga_category: 'bad', ga_action:'did not find search', ga_label: document.URL }, function(response) {});
  }
});

})(jQuery);
