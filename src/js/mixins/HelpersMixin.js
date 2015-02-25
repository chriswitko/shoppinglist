/** @jsx React.DOM */
var React = require('react');
var AppStore = require('../stores/app-store.js');

var HelpersMixin = function(cb) {
  return {
    getParameterByName: function (name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    },
    createUniqueArray: function (inputArray, sorter) {
      var arrResult = {};
      var nonDuplicatedArray = [];
      var i, n;

      for (i = 0, n = inputArray.length; i < n; i++) {
          var item = inputArray[i];

          if (sorter) {
              arrResult[item[sorter]] = item;
          } else {
              arrResult[item] = item;
          }
      }

      i = 0;

      for (var item in arrResult) {
          nonDuplicatedArray[i++] = arrResult[item];
      }

      return nonDuplicatedArray;
    },
  }
}

module.exports = HelpersMixin;
