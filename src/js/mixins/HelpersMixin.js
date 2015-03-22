/** @jsx React.DOM */
"use strict";

var HelpersMixin = {
  getParameterByName: function (name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  },

  createUniqueArray: function (inputArray, sorter) {
    var arrResult = {};
    var nonDuplicatedArray = [];
    var i, n, item;

    for (i = 0, n = inputArray.length; i < n; i++) {
        item = inputArray[i];

        if (sorter) {
            arrResult[item[sorter]] = item;
        } else {
            arrResult[item] = item;
        }
    }

    i = 0;

    for (item in arrResult) {
        nonDuplicatedArray[i++] = arrResult[item];
    }

    return nonDuplicatedArray;
  },

  getImageAsBase64: function (imgAddress, onready) {
    var self = this;
    var req = new XMLHttpRequest();
    req.open("GET", imgAddress, true);
    req.responseType = "arraybuffer"; //this won"t work with sync requests in FF
    req.onload = function () { onready(self.arrayBufferToDataUri(req.response)); };
    req.send(null);
  },

  arrayBufferToDataUri: function (arrayBuffer) {
    var base64 = "",
        encodings = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
        bytes = new Uint8Array(arrayBuffer), byteLength = bytes.byteLength,
        byteRemainder = byteLength % 3, mainLength = byteLength - byteRemainder,
        a, b, c, d, chunk;

    for (var i = 0; i < mainLength; i = i + 3) {
        chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
        a = (chunk & 16515072) >> 18; b = (chunk & 258048) >> 12;
        c = (chunk & 4032) >> 6; d = chunk & 63;
        base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d];
    }

    if (byteRemainder === 1) {
        chunk = bytes[mainLength];
        a = (chunk & 252) >> 2;
        b = (chunk & 3) << 4;
        base64 += encodings[a] + encodings[b] + "==";
    } else if (byteRemainder === 2) {
        chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1];
        a = (chunk & 16128) >> 8;
        b = (chunk & 1008) >> 4;
        c = (chunk & 15) << 2;
        base64 += encodings[a] + encodings[b] + encodings[c] + "=";
    }
    return "data:image/jpeg;base64," + base64;
  },

  repairUrl: function(url) {
    return url.indexOf("http") > -1 ? url : "http://" + url;
  }
};

module.exports = HelpersMixin;
