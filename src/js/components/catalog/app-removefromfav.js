/** @jsx React.DOM */
var React = require('react');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;

var AppActions = require('../../actions/app-actions.js');
var events = require('../../mixins/react-event-emitter.js');
var AppStore = require('../../stores/app-store.js');

var RemoveFromFav =
  React.createClass({
    mixins: [PureRenderMixin, events("removeItem")],

    handleClick: function(){
      var self = this;
      AppActions.removeFromFav(this.props.item, this.props.idx, function() {
        self.emitRemoveItem();
      });
    },

    render:function(){
      return <button onClick={this.handleClick} className="btn btn-default"><i className="fa fa-trash"></i></button>
    }
  });
module.exports = RemoveFromFav;