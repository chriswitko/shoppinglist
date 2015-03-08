/** @jsx React.DOM */
'use strict';

var React = require('react');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;
var Navigatable = require('react-router-component').NavigatableMixin

var AppActions = require('../../actions/app-actions');
var AppStore = require('../../stores/app-store');

var Link = require('react-router-component').Link;

function getStateFromStore() {
  return {
    isAuthed: AppStore.getCurrentUser()
  }
}

var Header =
  React.createClass({
    mixins: [PureRenderMixin, Navigatable],

    getInitialState: function() {
      return getStateFromStore();
    },

    _actionLogOut: function() {
      AppActions.logout();
    },

    render: function() {
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
                  { this.state.isAuthed ? <li><Link href="/" className={this.getPath()=="/"?"active":""}>All</Link></li> : null }
                  { this.state.isAuthed ? <li><Link href="/faved" className={this.getPath()=="/faved"?"active":""}>Faved</Link></li> : null }
                </ul>
              </div>
              <div className="col-sm-6 rar">
                <ul className="list-unstyled list-inline small">
                  { this.state.isAuthed ? null : <li><Link href="/login">Login</Link></li> }
                  { this.state.isAuthed ? null : <li><Link href="/register">Register</Link></li> }
                  { this.state.isAuthed ? <li><Link href="/submit">Submit new link</Link></li> : null }
                  { this.state.isAuthed ? <li><Link href="/settings">Settings</Link></li> : null }
                  { this.state.isAuthed ? <li><a onClick={this._actionLogOut}>Logout</a></li> : null }
                </ul>
              </div>
            </div>
          </div>
        </div>
        )
    }
  });

module.exports = Header;