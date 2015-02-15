var AppDispatcher = require('../dispatchers/app-dispatcher');
var AppConstants = require('../constants/app-constants');
var merge = require('react/lib/merge');
var EventEmitter = require('events').EventEmitter;
var Item = require('../data/item.js');
var Parse = require('parse').Parse;

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

function _removeItem(index){
  _cartItems[index].inCart = false;
  _cartItems.splice(index, 1);
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

function _createItem(item, cb) {
  Item.createByObject(item, cb);
  // this.navigate('/');
  // return item;
}

function _addItem(item){
  if(!item.inCart){
    item['qty'] = 1;
    item['inCart'] = true;
    _cartItems.push(item);
  }
  else {
    _cartItems.forEach(function(cartItem, i){
      if(cartItem.idx.toString()===item.idx.toString()){
        _increaseItem(i);
      }
    });
  }
}

function _setRemoteData() {
  var collection = new Item.Collection();
  var all = [];
  collection.query = new Parse.Query(Item);
  collection.fetch({
    success: function(obj) {
      // this.setState({data: data});
      _catalog = obj;
    },
    error: function(obj, err) {
      console.error('getAll() error', obj, err);
    }
  });
}

function _cartTotals() {
  var qty = 0, total = 0;
  _cartItems.forEach(function(cartItem) {
    qty += cartItem.qty;
    total += cartItem.qty * cartItem.cost;
  });

  // console.log('currentUser', this.state.currentUser);

  return {'qty': qty, 'total': total};
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

  dispatcherIndex:AppDispatcher.register(function(payload){
    var action = payload.action; // this is our action from handleViewAction
    switch(action.actionType){
      case AppConstants.CREATE_ITEM:
        _createItem(payload.action.item, payload.action.cb);
        break;

      case AppConstants.ADD_ITEM:
        _addItem(payload.action.item);
        break;

      case AppConstants.REMOVE_ITEM:
        _removeItem(payload.action.index);
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