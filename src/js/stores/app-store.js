/** @jsx React.DOM */
'use strict';

var AppDispatcher = require('../dispatchers/app-dispatcher');
var AppConstants = require('../constants/app-constants');
var merge = require('react/lib/merge');
var EventEmitter = require('events').EventEmitter;

var Parse = require('parse').Parse;

var Wish = require('../data/wish.js');

var CHANGE_EVENT = "change";

var BreakException= {};

var _catalog = [];
var _favedCatalog = [];

var _cartItems = [];

var _title = '';

var _pleaseRefresh = false;

var _currentUser = null;
var _password = null;

var page = 0;
var perPage = 48;

function _getCurrentUser() {
  _currentUser = Parse.User.current();
  if (_currentUser) {
      return _currentUser;
  } else {
      return null;
  }
}

function _setPleaseRefresh(val) {
  return _pleaseRefresh = val;
}

function _getPleaseRefresh() {
  return _pleaseRefresh;
}

function _removeItemFromCatalog(item, index, cb){
  if(_favedCatalog.length&&item.attributes.isFaved) {
    try {
      _favedCatalog.forEach(function(itm, idx) {
        if(itm.id==item.id) {
          _favedCatalog.splice(idx, 1);
          throw BreakException;
        }
      });
    } catch(e) {
        if (e!==BreakException) throw e;
    }
    // _favedCatalog[index].isRemoved = true;
    // _favedCatalog.splice(index, 1);
  }
  try {
    _catalog.forEach(function(itm, idx) {
      if(itm.id==item.id) {
        _catalog.splice(idx, 1);
        throw BreakException;
      }
    });
  } catch(e) {
      if (e!==BreakException) throw e;
  }
  // _catalog[index].isRemoved = true;
  // _catalog.splice(index, 1);
  cb();
}

function _updateItemTitle (title, cb) {
  _title = title;
  cb(_title||'Hello World');
}

function _getItemTitle (title, cb) {
  return _title;
}

function _addToFav(item, cb) {
  // if(_favedCatalog.length&&item.props.item.get('isFaved')) {
  //   try {
  //     _favedCatalog.forEach(function(itm, idx) {
  //       if(itm.id===item.props.item.id) {
  //         _favedCatalog.splice(idx, 1);
  //         throw BreakException;
  //       }
  //     });
  //   } catch(e) {
  //       if (e!==BreakException) throw e;
  //   }
  // }

  item.props.item.set("isFaved", !item.props.item.get('isFaved'));
  item.props.item.save({
    success: function(myObject) {
      cb(true);
    },
    error: function(myObject, error) {
      cb(error);
    }
  });
}

function _removeItem(item, index, cb){
  if(!_getCurrentUser()) return cb();
  _removeItemFromCatalog(item, index, function() {
    item.destroy({
      success: function(myObject) {
      },
      error: function(myObject, error) {
        console.log('remove err', error);
      }
    });
    cb();
  });
}

function _increaseItem(index){
  _cartItems[index].qty++;
}

function _decreaseItem(index){
  if(_cartItems[index].qty>1){
    _cartItems[index].qty--;
  } else {
    _removeItem(index);
  }
}

function _appLogout() {
  Parse.User.logOut();
  location = '/';
}

function _fetchMoreFavedWishes(page, callback) {
  Wish.getFaved('fetchData', page, perPage, AppStore.getCurrentUser(), function(wishes) {
    var its = wishes.models.map(function(item){
      return item;
    })
    callback(its);
  });
}

function showImage(imgAddress) {
    var img = document.createElement("img");
    document.body.appendChild(img);
    getImageAsBase64(imgAddress, function (base64data) { img.src = base64data; });
};

function getImageAsBase64(imgAddress, onready) {
    var req = new XMLHttpRequest();
    req.open("GET", imgAddress, true);
    req.responseType = 'arraybuffer'; //this won't work with sync requests in FF
    req.onload = function () { onready(arrayBufferToDataUri(req.response)); };
    req.send(null);
};

function arrayBufferToDataUri(arrayBuffer) {
  var base64 = '',
      encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
      bytes = new Uint8Array(arrayBuffer), byteLength = bytes.byteLength,
      byteRemainder = byteLength % 3, mainLength = byteLength - byteRemainder,
      a, b, c, d, chunk;

  for (var i = 0; i < mainLength; i = i + 3) {
      chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
      a = (chunk & 16515072) >> 18; b = (chunk & 258048) >> 12;
      c = (chunk & 4032) >> 6; d = chunk & 63;
      base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d];
  }

  if (byteRemainder == 1) {
      chunk = bytes[mainLength];
      a = (chunk & 252) >> 2;
      b = (chunk & 3) << 4;
      base64 += encodings[a] + encodings[b] + '==';
  } else if (byteRemainder == 2) {
      chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1];
      a = (chunk & 16128) >> 8;
      b = (chunk & 1008) >> 4;
      c = (chunk & 15) << 2;
      base64 += encodings[a] + encodings[b] + encodings[c] + '=';
  }
  return "data:image/jpeg;base64," + base64;
}

var AppStore = merge(EventEmitter.prototype, {
  emitChange:function(){
    this.emit(CHANGE_EVENT)
  },

  addChangeListener:function(callback){
    this.on(CHANGE_EVENT, callback)
  },

  removeChangeListener:function(callback){
    this.removeListener(CHANGE_EVENT, callback)
  },

  removeItemFromCatalog: function(item, idx, cb) {
    _removeItemFromCatalog(item, idx, cb);
  },

  fetchMoreFavedWishes: function(page, cb) {
    return _fetchMoreFavedWishes(page, cb);
  },

  getItemTitle: function() {
    return _getItemTitle();
  },

  getUsername: function() {
    var user = _getCurrentUser();
    return user.get('username');
  },

  getPassword: function() {
    return _password;
  },

  setPassword: function(password) {
    _password = password;
  },

  getCurrentUser: function() {
    return _getCurrentUser();
  },

  setPleaseRefresh: function(val) {
    return _setPleaseRefresh(val);
  },

  getPleaseRefresh: function() {
    return _getPleaseRefresh();
  },

  getCart:function(){
    return _cartItems
  },

  getCatalog:function(){
    return _catalog
  },

  getFavedCatalog:function(){
    return _favedCatalog
  },

  setCatalog:function(catalog){
    _catalog = catalog;
    return _catalog ;
  },

  setFavedCatalog:function(catalog){
    _favedCatalog = catalog;
    return _favedCatalog ;
  },

  setRemoteData: function() {
    return _setRemoteData();
  },

  getCartTotals: function() {
    return _cartTotals();
  },

  dispatcherIndex:AppDispatcher.register({}, function(payload){
    var action = payload.action; // this is our action from handleViewAction
    switch(action.actionType){
      case AppConstants.UPDATE_ITEM_TITLE:
        _updateItemTitle(payload.action.title, payload.action.cb);
        break;
      case AppConstants.LOGOUT_APP:
        _appLogout();
        break;
      case AppConstants.CREATE_ITEM:
        _createItem(payload.action.item, payload.action.cb);
        break;

      case AppConstants.ADD_ITEM:
        _addItem(payload.action.item);
        break;

      case AppConstants.ADD_TO_FAV:
        _addToFav(payload.action.item, payload.action.cb);
        break;

      case AppConstants.REMOVE_ITEM:
        _removeItem(payload.action.item, payload.action.index, payload.action.cb);
        break;

      case AppConstants.INCREASE_ITEM:
        _increaseItem(payload.action.index);
        break;

      case AppConstants.DECREASE_ITEM:
        _decreaseItem(payload.action.index);
        break;
    }
    AppStore.emitChange();

    return true;
  })
})

module.exports = AppStore;