/** @jsx React.DOM */
'use strict';

var React = require('react');
var Navigatable = require('react-router-component').NavigatableMixin

var AppStore = require('../../stores/app-store');

var Parse = require('parse').Parse;

var Link = require('react-router-component').Link;
var Alert = require('react-bootstrap').Alert;

var UserLogin =
  React.createClass({
    mixins: [Navigatable],

    getInitialState: function() {
      return {user: {}, password: '', error: false};
    },

    _onChangePassword: function(e) {
      this.setState({password: e.target.value});
    },

    _login: function() {
      var username = this.refs.username.getDOMNode().value;
      var password = this.refs.password.getDOMNode().value;

      if(!username||!password) return;

      Parse.User.logIn(username, password, {
        success: function(user) {
          AppStore.setPassword(password);
          location = '/';
        },
        error: function(user, error) {
          this.setState({error: true});
        }.bind(this)
      });

    },

    render: function() {
        return (
            <div className="row">
              <div className="col-xs-12 col-lg-4 col-md-4 col-sm-4">
                <h3>Login</h3>
                { this.state.error ? <Alert bsStyle="warning"><strong>Error</strong> Sorry, but your username or password is incorrect.</Alert> : null }
                <form className="form">
                  <div className="form-group">
                    <label htmlFor="exampleInputEmail1">Username</label>
                    <input type="text" className="form-control" id="username" ref="username" value={null} placeholder="Usename" autoFocus="true" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="exampleInputEmail1">Password</label>
                    <input type="password" className="form-control" id="password" ref="password" onChange={this._onChangePassword} value={this.state.password} placeholder="Password" />
                  </div>
                  <div className="form-group">
                    <input type="button" className="btn btn-success" onClick={this._login} value="Login..." />
                  </div>
                </form>
              </div>
              <div className="hidden-xs col-lg-8 col-md-8 col-sm-8"></div>
            </div>
          );
    }
  });

module.exports = UserLogin;