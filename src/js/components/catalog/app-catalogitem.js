/** @jsx React.DOM */
"use strict";

var React = require("react");
var PureRenderMixin = require("react/addons").addons.PureRenderMixin;

var AppStore = require("../../stores/app-store");

var BtnFav = require("./app-btnfav");
var BtnRemove = require("./app-btnremove");
var ItemImg = require("./app-img");

var CatalogItem =
  React.createClass({
    displayName: "CatalogItem",

    propTypes: {
      idx: React.PropTypes.number.isRequired,
      item: React.PropTypes.object.isRequired
    },

    mixins: [PureRenderMixin],

    isAuthed: function() {
      return AppStore.getCurrentUser();
    },

    render: function() {
      var itemStyle = {
        paddingBottom: "20px"
      };
      var toolbarStyle = {
        display: ( this.isAuthed() ? "block" : "none" )
      };

      return (
        <div ref="me" className="col-sm-3 col-xs-12 gridItem" style={itemStyle}>
          <h4 className="ellipsis-txt"><a rel="external" target="_blank" href={this.props.item.get("url")}>{this.props.item.get("title")}</a></h4>
          <a rel="external" target="_blank" href={this.props.item.get("url")}><ItemImg url={ this.props.item.get("img") || this.props.item.get("picture").url() }/></a>
          <div className="btn-group btn-group-xs mt10" style={toolbarStyle}>
            <a rel="external" target="_blank" href={this.props.item.get("url")} className="btn btn-default">Visit site</a>
            {this.isAuthed() ? <BtnFav isFaved={this.props.item.get("isFaved")} item={this.props.item} /> : null}
            {this.isAuthed() ? <BtnRemove item={this.props.item} idx={this.props.idx} /> : null}
          </div>
        </div>
        );
    }
  });

module.exports = CatalogItem;
