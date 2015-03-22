/** @jsx React.DOM */
"use strict";

var React = require("react");
var Navigatable = require("react-router-component").NavigatableMixin;

var Parse = require("parse").Parse;

var Alert = require("react-bootstrap").Alert;

var UserRegister =
  React.createClass({
    displayName: "UserRegister",

    mixins: [Navigatable],

    getInitialState: function() {
      return {user: {}, password: "", error: false, message: "Sorry, but your username or password is incorrect."};
    },

    onChangePassword: function(e) {
      this.setState({password: e.target.value});
    },

    registerNewUser: function() {
      var username = this.refs.username.getDOMNode().value;
      var email = this.refs.email.getDOMNode().value;
      var password = this.refs.password.getDOMNode().value;
      if(!username || !email || !password) {
        return;
      }

      var user = new Parse.User();
          user.set("username", username);
          user.set("password", password);
          user.set("email", email);

      user.signUp(null, {
        success: function() {
          this.navigate("/login");
        }.bind(this),
        error: function(profile, error) {
          this.setState({password: "", message: error.message, error: true});
        }.bind(this)
      });
    },

    render: function() {
        return (
          <div className="row">
            <div className="col-xs-4">
              <h3>Register new user</h3>
              { this.state.error ? <Alert bsStyle="warning"><strong>Error</strong> {this.state.message}</Alert> : null }
              <form className="form">
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Username</label>
                  <input type="text" className="form-control" id="username" ref="username" value={null} placeholder="Usename" autoFocus="true" />
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Email address</label>
                  <input type="text" className="form-control" id="email" ref="email" value={null} placeholder="Email" />
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Password</label>
                  <input type="password" className="form-control" id="password" ref="password" onChange={this.onChangePassword} value={this.state.password} placeholder="Password" />
                </div>
                <div className="form-group">
                  <input type="button" className="btn btn-success" onClick={this.registerNewUser} value="Register" />
                </div>
              </form>
            </div>
            <div className="col-xs-8"></div>
          </div>
          );
    }
  });

module.exports = UserRegister;
