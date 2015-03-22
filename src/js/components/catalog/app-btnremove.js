/** @jsx React.DOM */
"use strict";

var React = require("react");
var PureRenderMixin = require("react/addons").addons.PureRenderMixin;

var AppActions = require("../../actions/app-actions");

var BtnRemove =
  React.createClass({
    displayName: "BtnRemove",

    propTypes: {
      item: React.PropTypes.object.isRequired,
      idx: React.PropTypes.number.isRequired
    },

    mixins: [PureRenderMixin],

    handleClick: function(){
      AppActions.removeFromFav(this.props.item, this.props.idx, function() {
      });
    },

    render: function(){
      return (
        <button onClick={this.handleClick} className="btn btn-default"><i className="fa fa-trash"></i></button>
        );
    }
  });
module.exports = BtnRemove;
