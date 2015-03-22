/** @jsx React.DOM */
"use strict";

var React = require("react");
var AppActions = require("../../actions/app-actions");
var PureRenderMixin = require("react/addons").addons.PureRenderMixin;

var BtnFav =
  React.createClass({
    displayName: "BtnFav",

    propTypes: {
      isFaved: React.PropTypes.bool.isRequired,
      item: React.PropTypes.object.isRequired
    },

    mixins: [PureRenderMixin],

    getInitialState: function() {
      return {"isFaved": this.props.isFaved};
    },

    getDefaultProps: function() {
      return {
        isFaved: false
      };
    },

    handleClick: function() {
      AppActions.addToFav(this, function() {
        this.setState({"isFaved": !this.state.isFaved});
      }.bind(this));
    },

    render: function() {
      return (
        <button onClick={this.handleClick} className="btn btn-default"><i className={ this.state.isFaved ? "fa fa-star pink" : "fa fa-star-o" }></i> { this.state.isFaved ? "Faved" : "Add to Fave" }</button>
        );
    }
  });

module.exports = BtnFav;
