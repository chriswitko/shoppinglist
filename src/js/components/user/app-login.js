/** @jsx React.DOM */
var React = require('react');
var AppStore = require('../../stores/app-store.js');
var StoreWatchMixin = require('../../mixins/StoreWatchMixin.js');
var Link = require('react-router-component').Link;
var FetchingMixin = require('../../mixins/FetchingMixin.js');
var Parse = require('parse').Parse;
var Navigatable = require('react-router-component').NavigatableMixin
var events = require('../../mixins/react-event-emitter.js');
var Alert = require('react-bootstrap').Alert;

function getCurrentUser(component) {
  return {};
}

var UserLogin =
  React.createClass({
    modelState: ['item'],
    mixins: [StoreWatchMixin(getCurrentUser), Navigatable, events("authed")],//events("updateHeaderView"),

    getInitialState: function() {
      return {user: {}, password: '', error: false};
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
          // self.emitUpdateHeaderView();
          // self.emitAuthed();
          // self.navigate('/');
          location = '/';
          // Do stuff after successful login.
        },
        error: function(user, error) {
          self.setState({error: true});
          // alert("Error: " + error.code + " " + error.message);
          // The login failed. Check error to see why.
        }
      });

    },

    render:function(){
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
                    <input type="password" className="form-control" id="password" ref="password" onChange={this.onChange} value={this.state.password} placeholder="Password" />
                  </div>
                  <div className="form-group">
                    <input type="button" className="btn btn-success" onClick={this.login} value="Login..." />
                  </div>
                </form>
              </div>
              <div className="hidden-xs col-lg-8 col-md-8 col-sm-8"></div>
            </div>
          );
    }
  });
module.exports = UserLogin;