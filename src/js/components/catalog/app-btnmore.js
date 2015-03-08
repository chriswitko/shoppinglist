/** @jsx React.DOM */
'use strict';

var React = require('react');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;

var BtnMore =
  React.createClass({
    propTypes: {
      callback: React.PropTypes.func.isRequired
    },

    mixins: [PureRenderMixin],

    render: function() {
      return <button onClick={this.props.callback} className="btn btn-link btn-more">SHOW ME MORE<br/><i className='fa fa-chevron-down pink'></i></button>
    }
  });

module.exports = BtnMore;