/** @jsx React.DOM */
var React = require('react');
var AppStore = require('../../stores/app-store.js');
var RemoveFromCart = require('./app-removefromcart.js');
var Increase = require('./app-increase.js');
var Decrease = require('./app-decrease.js');
var StoreWatchMixin = require('../../mixins/StoreWatchMixin.js');
var Link = require('react-router-component').Link;

var Test =
  React.createClass({
    render:function(){
      return null
    }
  });
module.exports = Test;