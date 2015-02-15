/** @jsx React.DOM */
var React = require('react');
var AppStore = require('../stores/app-store.js');

var StoreWatchMixin = function(cb) {
  return {
    getInitialState:function(){
      // this.setState({currentUser: AppStore.getCurrentUser()});
      // this.fetchData();
      // if (typeof this.fetchData == 'function') { this.fetchData(); }
      return cb(this);
    },
    componentWillMount:function(){
      // if (typeof this.fetchData == 'function') { this.fetchData(); }
      AppStore.addChangeListener(this._onChange);
    },
    componentWillUnmount:function(){
      AppStore.removeChangeListener(this._onChange);
    },
    _onChange:function(){
      // cb(this);
      this.setState(cb(this));
    }
  }
}

module.exports = StoreWatchMixin;
