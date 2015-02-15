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

var UserRegister =
  React.createClass({
    modelState: ['item'],
    mixins: [StoreWatchMixin(getCurrentUser), Navigatable],

    getInitialState: function() {
      return {user: {}, password: ''};
    },

    fetchData: function() {
      return true;
    },

    onChange: function(e) {
      this.setState({password: e.target.value});
    },

    registerNewUser: function() {
      var username = this.refs.username.getDOMNode().value;
      var email = this.refs.email.getDOMNode().value;
      var password = this.refs.password.getDOMNode().value;
      if(!username||!email||!password) return;

      var user = new Parse.User();
      user.set("username", username);
      user.set("password", password);
      user.set("email", email);

      var self = this;
      user.signUp(null, {
        success: function(user) {
          alert('Hooray!');
          // Hooray! Let them use the app now.
        },
        error: function(user, error) {
          // Show the error message somewhere and let the user try again.
          alert("Error: " + error.code + " " + error.message);
          self.setState({password: ''});
        }
      });
    },

    render:function(){
        return (
          <div className="col-xs-6 col-xs-push-3">
            <h2>Register new user</h2>
            <form className="form">
              <div className="form-group">
                <label htmlFor="exampleInputEmail1">Username</label>
                <input type="text" className="form-control" id="username" ref="username" value={null} placeholder="Usename" />
              </div>
              <div className="form-group">
                <label htmlFor="exampleInputEmail1">Email address</label>
                <input type="text" className="form-control" id="email" ref="email" value={null} placeholder="Email" />
              </div>
              <div className="form-group">
                <label htmlFor="exampleInputEmail1">Password</label>
                <input type="password" className="form-control" id="password" ref="password" onChange={this.onChange} value={this.state.password} placeholder="Password" />
              </div>
              <div className="form-group">
                <input type="button" className="btn btn-default" onClick={this.registerNewUser} value="Register" />
              </div>
            </form>
          </div>
          );
    }
  });
module.exports = UserRegister;