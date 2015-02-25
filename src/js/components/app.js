/** @jsx React.DOM */
var React = require('react');
var Catalog = require('../components/catalog/app-catalog.js');
var Faved = require('../components/catalog/app-faved.js');
var Template = require('../components/app-template.js');
var Register = require('../components/user/app-register.js');
var Login = require('../components/user/app-login.js');
var UserSettings = require('../components/user/app-settings.js');
var UserSettingsImport = require('../components/user/app-settings-import.js');
var WishSubmit = require('../components/catalog/app-submit.js');

var Router = require('react-router-component');
var NotFound = Router.NotFound;
var Locations = Router.Locations;
var Location = Router.Location;

var APP =
  React.createClass({
    handleNavigation: function() {
      console.log( 'works great' );
    },
    hideProgressBar: function() {
      console.log( 'works great' );
    },
    render: function(){
      return (
        <Template>
          <Locations onBeforeNavigation={this.handleNavigation} onNavigation={this.hideProgressBar}>
            <Location path="/" handler={Catalog} />
            <Location path="/faved" handler={Faved} />
            <Location path="/register" handler={Register} />
            <Location path="/login" handler={Login} />
            <Location path="/settings" handler={UserSettings} />
            <Location path="/submit" handler={WishSubmit} />
            <Location path="/settings/:module" handler={UserSettingsImport} />
            <NotFound handler={Catalog} />
          </Locations>
        </Template>
        )
    }
  });
module.exports = APP;
