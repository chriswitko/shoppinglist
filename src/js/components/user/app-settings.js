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
var HelpersMixin = require('../../mixins/HelpersMixin.js');

var Router = require('react-router-component');
var Locations = Router.Locations;
var Location = Router.Location;

function getCurrentUser(component) {
  return {};
}

var UserSettings =
  React.createClass({
    mixins: [StoreWatchMixin(getCurrentUser), Navigatable, events("authed"), HelpersMixin],//events("updateHeaderView"),

    getInitialState: function() {
      return {user: {}, password: '', error: false};
    },

    onChange: function(e) {
      this.setState({password: e.target.value});
    },

    render:function(){
        // console.log('Locations', this.props.service);
        // locations.push(Location({path: href, handler: tab.handler}));
        return (
            <div className="row">
              <div className="col-xs-12">
                <h3>Settings</h3>
                <p className="small">You can easyli import data from external sources. Below you will find supported services. Feel free to contact us if you will have questions.</p>
                <div className="clearfix">
                  <ul className="list-unstyled">
                    <li><Link href="/settings/szopuje">Import data from Szopuje.pl</Link></li>
                  </ul>
                </div>
              </div>
            </div>
          );
    }
  });
module.exports = UserSettings;