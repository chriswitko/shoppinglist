var AppDispatcher = require('../dispatchers/app-dispatcher');
var AppConstants = require('../constants/app-constants');
var merge = require('react/lib/merge');
var EventEmitter = require('events').EventEmitter;
var Parse = require('parse').Parse;
var Wish = require('../data/wish.js');

var CHANGE_EVENT = "change";

var _catalog = [];

var _cartItems = [];

var _pleaseRefresh = false;

var _currentUser = null;
var _password = null;

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
  _catalog[index].isRemoved = true;
  _catalog.splice(index, 1);
  cb();
}

function _addToFav(item, cb) {
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
  item.destroy({
    success: function(myObject) {
      _removeItemFromCatalog(item, index, function() {
        // self.props.helloWorld.getDOMNode().remove();
        cb();
      });
    },
    error: function(myObject, error) {
    }
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


function _submit(item, cb) {
  var url = item.refs.url.getDOMNode().value;
  var title = item.refs.title.getDOMNode().value;
  var image_url = item.refs.image_url.getDOMNode().value;
  var image = item.refs.image.getDOMNode();
  if(!image.files.length&&!image_url) return;

  var ts = Math.floor(Date.now() / 1000);
  var name = "photo_" + ts.toString() + ".jpg";

  if (image.files.length > 0) {
    var file = image.files[0];
    var parseFile = new Parse.File(name, file);
    parseFile.save().then(function() {
      Wish.createByObject({
        'url': url,
        'title': title,
        'user': AppStore.getCurrentUser(),
        'picture': parseFile
      }, function() {
        cb();
      });
    }, function(error) {
      cb(error);
    });
  } else {
    getImageAsBase64(image_url, function(file) {
      var parseFile = new Parse.File(name, { base64: file });
      parseFile.save().then(function() {
        Wish.createByObject({
          'url': url,
          'title': title,
          'user': AppStore.getCurrentUser(),
          'picture': parseFile
        }, function() {
          cb();
        });
      }, function(error) {
        cb(error);
      });
    })
  }
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

  setCatalog:function(catalog){
    _catalog = catalog;
    return _catalog ;
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
      case AppConstants.SUBMIT:
        _submit(payload.action.item, payload.action.cb);
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