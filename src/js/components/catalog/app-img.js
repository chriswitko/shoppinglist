/** @jsx React.DOM */
'use strict';

var React = require('react');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;

var Img =
  React.createClass({
    propTypes: {
      maxWidth: React.PropTypes.number.isRequired,
      url: React.PropTypes.string.isRequired
    },

    mixins: [PureRenderMixin],

    getInitialState: function() {
      return {width: 0, maxWidth: this.props.maxWidth};
    },

    getDefaultProps: function() {
      return {
        maxWidth: 340
      };
    },

    componentDidMount: function () {
      var width = this.refs.me.getDOMNode().offsetWidth;
      this.setState({width: width});

      window.addEventListener('resize', this.handleResize);
    },

    componentWillUnmount: function() {
      window.removeEventListener('resize', this.handleResize);
    },

    handleResize: function(e) {
      var width = this.refs.me.getDOMNode().offsetWidth;
      this.setState({width: width});
    },

    render: function() {
      var maxResponsive = {
        width: '100%'
      };
      var currentWidth = this.state.width;
      if(this.state.width<158) currentWidth = this.state.maxWidth||340;
      var itemStyle = {
        backgroundImage: 'url('+this.props.url+')',
        backgroundSize: 'cover',
        backgroundPosition: '50% 50%',
        width: currentWidth,
        height: currentWidth,
        overflow: 'hidden'
      };
      return (
        <div ref="me" className="clearfix" style={maxResponsive}>
          <div style={itemStyle}>
          </div>
        </div>
        )
    }
  });

module.exports = Img;