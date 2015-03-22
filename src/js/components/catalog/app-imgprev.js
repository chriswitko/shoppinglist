/** @jsx React.DOM */
"use strict";

var React = require("react");
var PureRenderMixin = require("react/addons").addons.PureRenderMixin;

var ItemImg = require("./app-img");

var ImgPrev =
  React.createClass({
    displayName: "ImgPrev",

    propTypes: {
      callback: React.PropTypes.func.isRequired,
      image: React.PropTypes.string.isRequired,
      imageUrl: React.PropTypes.string.isRequired,
      title: React.PropTypes.string.isRequired
    },

    mixins: [PureRenderMixin],

    callback: function() {
      var self = this;
      this.props.callback({
        title: self.props.title,
        imageUrl: self.props.imageUrl
      });
    },

    render: function() {
      return (
        <div className="clickable" onClick={this.callback}>
          {this.props.title}
          <div className="clearfix mt10">
            <ItemImg url={this.props.image} image={this.props.imageUrl} maxWidth={100}/>
          </div>
        </div>
        );
    }
  });

module.exports = ImgPrev;
