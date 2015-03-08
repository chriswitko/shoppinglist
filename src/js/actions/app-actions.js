'use strict';

var AppConstants = require('../constants/app-constants.js');
var AppDispatcher = require('../dispatchers/app-dispatcher.js');

var AppActions = {
  updateTitle: function(title, cb) {
    AppDispatcher.handleViewAction({
      actionType: AppConstants.UPDATE_ITEM_TITLE,
      title: title,
      cb: cb
    });
  },
  removeFromFav: function(item, index, cb) {
    AppDispatcher.handleViewAction({
      actionType: AppConstants.REMOVE_ITEM,
      item: item,
      index: index,
      cb: cb
    });
  },
  addToFav: function(item, cb) {
    AppDispatcher.handleViewAction({
      actionType: AppConstants.ADD_TO_FAV,
      item: item,
      cb: cb
    })
  },
  submit: function(item, cb) {
    AppDispatcher.handleViewAction({
      actionType: AppConstants.SUBMIT,
      item: item,
      cb: cb
    })
  },
  logout: function() {
    AppDispatcher.handleViewAction({
      actionType: AppConstants.LOGOUT_APP,
    })
  },
  createItem:function(item, cb){
    AppDispatcher.handleViewAction({
      actionType: AppConstants.CREATE_ITEM,
      item: item,
      cb: cb
    })
  },
  addItem:function(item){
    AppDispatcher.handleViewAction({
      actionType: AppConstants.ADD_ITEM,
      item: item
    })
  },
  removeItem:function(item){
    AppDispatcher.handleViewAction({
      actionType: AppConstants.REMOVE_ITEM,
      item: item,
      cb: cb
    })
  },
  decreaseItem:function(index){
    AppDispatcher.handleViewAction({
      actionType: AppConstants.DECREASE_ITEM,
      index: index
    })
  },
  increaseItem:function(index){
    AppDispatcher.handleViewAction({
      actionType: AppConstants.INCREASE_ITEM,
      index: index
    })
  }
}

module.exports = AppActions;