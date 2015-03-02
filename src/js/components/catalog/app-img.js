/** @jsx React.DOM */
var React = require('react');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;

var Link = require('react-router-component').Link;
var events = require('../../mixins/react-event-emitter.js');

var AppStore = require('../../stores/app-store.js');

var ItemImg =
  React.createClass({
    mixins: [PureRenderMixin],

    repairUrl: function(url) {
      return url;
    },

    isAuthed: function() {
      return AppStore.getCurrentUser();
    },

    getInitialState: function() {
      return {width: 0};
    },

    componentDidMount: function () {
      window.addEventListener('resize', this.handleResize);
      var width = this.refs.me.getDOMNode().offsetWidth;
      this.setState({width: width});
    },

    componentWillUnmount: function() {
      window.removeEventListener('resize', this.handleResize);
    },

    handleResize: function(e) {
      var width = this.refs.me.getDOMNode().offsetWidth;
      this.setState({width: width});
    },

    render:function(){
      var maxResponsive = {
        width: '100%'
      };
      var areaStyle = {
        width: this.state.width
      };
      var currentWidth = this.state.width;
      if(this.state.width<158) currentWidth = 340;
      var itemStyle = {
        width: currentWidth,
        height: currentWidth,
        overflow: 'hidden'
      };
      return (
        <div ref="me" className="clearfix" style={maxResponsive}>
          <div style={itemStyle}>
            <img src={this.props.item.get('img')||this.props.item.get("picture").url()} className="img-responsive" style={maxResponsive}/>
          </div>
        </div>
        )
    }
  });
module.exports = ItemImg;