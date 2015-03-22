/** @jsx React.DOM */
"use strict";

var React = require("react");
var Navigatable = require("react-router-component").NavigatableMixin;

var Link = require("react-router-component").Link;

var UserSettings =
  React.createClass({
    displayName: "UserSettings",

    mixins: [Navigatable],

    getInitialState: function() {
      return {user: {}, password: "", error: false};
    },

    render: function() {
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
