/** @jsx React.DOM */
"use strict";

var AppDispatcher = require("../dispatchers/app-dispatcher");
var AppConstants = require("../constants/app-constants");
var merge = require("react/lib/merge");
var EventEmitter = require("events").EventEmitter;

var Parse = require("parse").Parse;

var Wish = require("../data/wish.js");

var CHANGE_EVENT = "change";

var BreakException = {};

var catalog = [];
var favedCatalog = [];

var cartItems = [];

var pleaseRefresh = false;

var currentUser = null;
var password = null;

var perPage = 48;

function getCurrentUser() {
  currentUser = Parse.User.current();
  if (currentUser) {
      return currentUser;
  } else {
      return null;
  }
}

function setPleaseRefresh(val) {
  pleaseRefresh = val;
  return pleaseRefresh;
}

function getPleaseRefresh() {
  return pleaseRefresh;
}

function removeItemFromCatalog(item, index, cb){
  if(favedCatalog.length && item.attributes.isFaved) {
    try {
      favedCatalog.forEach(function(itm, idx) {
        if(itm.id === item.id) {
          favedCatalog.splice(idx, 1);
          throw BreakException;
        }
      });
    } catch(e) {
        if (e !== BreakException) {
          throw e;
        }
    }
  }
  try {
    catalog.forEach(function(itm, idx) {
      if(itm.id === item.id) {
        catalog.splice(idx, 1);
        throw BreakException;
      }
    });
  } catch(e) {
      if (e !== BreakException) {
        throw e;
      }
  }
  cb();
}

function updateItemTitle (title, cb) {
  title = title;
  cb(title || "Hello World");
}

function getItemTitle (title) {
  return title;
}

function addToFav(item, cb) {
  item.props.item.set("isFaved", !item.props.item.get("isFaved"));
  item.props.item.save({
    success: function() {
      cb(true);
    },
    error: function(myObject, error) {
      cb(error);
    }
  });
}

function removeItem(item, index, cb){
  if(!getCurrentUser()) {
    return cb();
  }
  removeItemFromCatalog(item, index, function() {
    item.destroy({
      error: function(myObject, error) {
        cb(error);
      }
    });
    cb();
  });
}

function increaseItem(index){
  cartItems[index].qty++;
}

function decreaseItem(index){
  if(cartItems[index].qty > 1){
    cartItems[index].qty--;
  } else {
    removeItem(index);
  }
}

function appLogout() {
  Parse.User.logOut();
  top.location = "/";
}

function fetchMoreFavedWishes(page, callback) {
  Wish.getFaved("fetchData", page, perPage, getCurrentUser(), function(wishes) {
    var its = wishes.models.map(function(item){
      return item;
    });
    callback(its);
  });
}

var AppStore = merge(EventEmitter.prototype, {
  emitChange: function(){
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback){
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback){
    this.removeListener(CHANGE_EVENT, callback);
  },

  removeItemFromCatalog: function(item, idx, cb) {
    removeItemFromCatalog(item, idx, cb);
  },

  fetchMoreFavedWishes: function(page, cb) {
    return fetchMoreFavedWishes(page, cb);
  },

  getItemTitle: function() {
    return getItemTitle();
  },

  getUsername: function() {
    var user = getCurrentUser();
    return user.get("username");
  },

  getPassword: function() {
    return password;
  },

  setPassword: function(pass) {
    password = pass;
  },

  getCurrentUser: function() {
    return getCurrentUser();
  },

  setPleaseRefresh: function(val) {
    return setPleaseRefresh(val);
  },

  getPleaseRefresh: function() {
    return getPleaseRefresh();
  },

  getCart: function(){
    return cartItems;
  },

  getCatalog: function(){
    return catalog;
  },

  getFavedCatalog: function(){
    return favedCatalog;
  },

  setCatalog: function(cat){
    catalog = cat;
    return catalog;
  },

  setFavedCatalog: function(cat){
    favedCatalog = cat;
    return favedCatalog;
  },

  dispatcherIndex: AppDispatcher.register({}, function(payload) {
    var action = payload.action; // this is our action from handleViewAction
    switch(action.actionType){
      case AppConstants.UPDATE_ITEM_TITLE:
        updateItemTitle(payload.action.title, payload.action.cb);
        break;

      case AppConstants.LOGOUT_APP:
        appLogout();
        break;

      case AppConstants.ADD_TO_FAV:
        addToFav(payload.action.item, payload.action.cb);
        break;

      case AppConstants.REMOVE_ITEM:
        removeItem(payload.action.item, payload.action.index, payload.action.cb);
        break;

      case AppConstants.INCREASE_ITEM:
        increaseItem(payload.action.index);
        break;

      case AppConstants.DECREASE_ITEM:
        decreaseItem(payload.action.index);
        break;
    }
    AppStore.emitChange();

    return true;
  })
});

module.exports = AppStore;
