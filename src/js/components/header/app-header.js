/** @jsx React.DOM */
var React = require('react');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;

var AppActions = require('../../actions/app-actions.js');
var AppStore = require('../../stores/app-store.js');

var Link = require('react-router-component').Link;
var Button = require('react-bootstrap').Button;
var HighlightedLink = require('./app-highlightedlink.js');

var Navigatable = require('react-router-component').NavigatableMixin
var events = require('../../mixins/react-event-emitter.js');
var Router = require('react-router-component');

var Header =
  React.createClass({
    mixins: [PureRenderMixin, Navigatable, events("authed")],

    getInitialState: function() {
      return {isAuthed: AppStore.getCurrentUser()};
    },

    onAuthed: function() {
      this.setState({isAuthed: AppStore.getCurrentUser()});
    },

    actionLogOut: function() {
      AppActions.logout();
    },

    render:function(){
      return (
        <div className="row">
          <div className="col-sm-12 ac">
            <h1 className="strong mb0 logo"><a href="/">ShoppingList</a></h1>
          </div>
          <div className="col-sm-12 mt10">
            <div className="row">
              <div className="col-sm-6">
                <p className="m0 light mt5 small"></p>
                <ul className="list-unstyled list-inline small">
                  { this.state.isAuthed ? null : <li>Hello. Keep your shopping list in one place.</li> }
                  { this.state.isAuthed ? <li><a href="/" className={this.getPath()=="/"?"active":""}>My Shopping List</a></li> : null }
                  { this.state.isAuthed ? <li><i className="fa fa-star pink"></i> <a href="/faved" className={this.getPath()=="/faved"?"active":""}>Faved</a></li> : null }
                  { this.state.isAuthed ? <li><Link href="/submit">Submit new link</Link></li> : null }
                </ul>
              </div>
              <div className="col-sm-6 rar">
                <ul className="list-unstyled list-inline small">
                  { this.state.isAuthed ? null : <li><Link href="/login">Login</Link></li> }
                  { this.state.isAuthed ? null : <li><Link href="/register">Register</Link></li> }
                  { this.state.isAuthed ? <li><Link href="/settings">Settings</Link></li> : null }
                  { this.state.isAuthed ? <li><Link onClick={this.actionLogOut}>Logout</Link></li> : null }
                </ul>
              </div>
            </div>
          </div>
        </div>
        )
    }
  });
module.exports = Header;