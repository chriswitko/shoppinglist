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

function _submit(item, cb) {
  var url = item.refs.url.getDOMNode().value;
  var title = item.refs.title.getDOMNode().value;
  var image = item.refs.image.getDOMNode();
  if(!image.files.length) return;

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
    cb();
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