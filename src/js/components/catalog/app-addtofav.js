/** @jsx React.DOM */
var React = require('react');
var AppActions = require('../../actions/app-actions.js');

var AddToFave =
  React.createClass({
    getInitialState: function() {
      return {'isFaved': this.props.item.get('isFaved')}
    },

    handleClick:function(){
      var self = this;
      AppActions.addToFav(this, function(output) {
        self.setState({'isFaved': self.props.item.get('isFaved')});
      });
    },
    render:function(){
      return <button onClick={this.handleClick} className="btn btn-default"><i className={this.state.isFaved?'fa fa-star pink':'fa fa-star-o'}></i> {this.state.isFaved?'Faved':'Add to Fave'} {this.state.isFaved}</button>
    }
  });

module.exports = AddToFave;