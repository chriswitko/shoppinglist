/** @jsx React.DOM */
var React = require('react');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;

var Fav = require('./app-addtofav.js');
var BtnRemove = require('./app-removefromfav.js');
var ItemImg = require('./app-img.js');

var Link = require('react-router-component').Link;
var Button = require('react-bootstrap').Button;
var events = require('../../mixins/react-event-emitter.js');

var AppStore = require('../../stores/app-store.js');

var CatalogItem =
  React.createClass({
    mixins: [PureRenderMixin],

    repairUrl: function(url) {
      return url;
    },

    isAuthed: function() {
      return AppStore.getCurrentUser();
    },

    render:function(){
      var itemStyle = {
        paddingBottom: '20px'
      };
      var toolbarStyle = {
        display: (this.isAuthed()?'block':'none'),
      };
      return (
        <div ref="me" className="col-sm-3 col-xs-12 gridItem" style={itemStyle}>
          <h4 className="ellipsis-txt"><a rel="external" target="_blank" href={this.repairUrl(this.props.item.get('url'))}>{this.props.item.get('title')}</a></h4>
          <a rel="external" target="_blank" href={this.repairUrl(this.props.item.get('url'))}><ItemImg item={this.props.item}/></a>
          <div className="btn-group btn-group-xs mt10" style={toolbarStyle}>
            <a rel="external" target="_blank" href={this.repairUrl(this.props.item.get('url'))} className="btn btn-default">Visit site</a>
            {this.isAuthed() ? <Fav item={this.props.item} /> : null}
            {this.isAuthed() ? <BtnRemove item={this.props.item} idx={this.props.idx} /> : null}
          </div>
        </div>
        )
    }
  });
module.exports = CatalogItem;