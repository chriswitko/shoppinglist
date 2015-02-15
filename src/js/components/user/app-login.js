/** @jsx React.DOM */
var React = require('react');
var AppStore = require('../../stores/app-store.js');
var AddToCart = require('../catalog/app-addtocart.js');
var StoreWatchMixin = require('../../mixins/StoreWatchMixin.js');
var Link = require('react-router-component').Link;
var FetchingMixin = require('../../mixins/FetchingMixin.js');
var Item = require('../../data/item.js');
var Parse = require('parse').Parse;
var Navigatable = require('react-router-component').NavigatableMixin
var events = require('../../mixins/react-event-emitter.js');

function getCurrentUser(component) {
  return {};
}

var UserLogin =
  React.createClass({
    modelState: ['item'],
    mixins: [StoreWatchMixin(getCurrentUser), Navigatable, events("updateHeaderView")],

    getInitialState: function() {
      return {user: {}, password: ''};
    },

    fetchData: function() {
      return true;
    },

    onChange: function(e) {
      this.setState({password: e.target.value});
    },

    login: function() {
      var username = this.refs.username.getDOMNode().value;
      var password = this.refs.password.getDOMNode().value;
      if(!username||!password) return;
      var self = this;

      Parse.User.logIn(username, password, {
        success: function(user) {
          console.log('LOGGED IN', user);
          AppStore.setPassword(password);
          self.emitUpdateHeaderView();
          self.navigate('/');
          // Do stuff after successful login.
        },
        error: function(user, error) {
          alert("Error: " + error.code + " " + error.message);
          // The login failed. Check error to see why.
        }
      });

    },

    render:function(){
        return (
          <div className="col-xs-6 col-xs-push-3">
            <h2>Login</h2>
            <form className="form">
              <div className="form-group">
                <label htmlFor="exampleInputEmail1">Username</label>
                <input type="text" className="form-control" id="username" ref="username" value={null} placeholder="Usename" />
              </div>
              <div className="form-group">
                <label htmlFor="exampleInputEmail1">Password</label>
                <input type="password" className="form-control" id="password" ref="password" onChange={this.onChange} value={this.state.password} placeholder="Password" />
              </div>
              <div className="form-group">
                <input type="button" className="btn btn-default" onClick={this.login} value="Login..." />
              </div>
            </form>
          </div>
          );
    }
  });
module.exports = UserLogin;