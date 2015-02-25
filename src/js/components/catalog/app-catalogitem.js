/** @jsx React.DOM */
var React = require('react');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;

var Fav = require('./app-addtofav.js');
var BtnRemove = require('./app-removefromfav.js');

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
        <div className="col-sm-3 gridItem" style={itemStyle}>
          <h4><a rel="external" target="_blank" href={this.repairUrl(this.props.item.get('url'))}>{this.props.item.get('title')}</a></h4>
          <a rel="external" target="_blank" href={this.repairUrl(this.props.item.get('url'))}><img src={this.props.item.get('img')||this.props.item.get("picture").url()} className="img-responsive"/></a>
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