/** @jsx React.DOM */
"use strict";

var React = require("react");
var Header = require("../components/header/app-header.js");

var Template =
  React.createClass({
    displayName: "Template",
    render: function() {
      return (
        <div>
          <div className="container">
            <Header />
            {this.props.children}
          </div>
        </div>
        );
    }
  });

module.exports = Template;
