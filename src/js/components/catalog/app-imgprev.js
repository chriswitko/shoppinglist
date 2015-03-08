/** @jsx React.DOM */
'use strict';

var React = require('react');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;

var ItemImg = require('./app-img');

var ImgPrev =
  React.createClass({
    propTypes: {
      callback: React.PropTypes.func.isRequired,
      image: React.PropTypes.string.isRequired,
      image_url: React.PropTypes.string.isRequired
    },

    mixins: [PureRenderMixin],

    _callback: function() {
      var self = this;
      this.props.callback({
        title: self.props.title,
        image_url: self.props.image_url
      });
    },

    render: function() {
      return (
        <div className="clickable" onClick={this._callback}>
          {this.props.title}
          <div className="clearfix mt10">
            <ItemImg url={this.props.image} image={this.props.image_url} maxWidth={100}/>
          </div>
        </div>
        )
    }
  });

module.exports = ImgPrev;