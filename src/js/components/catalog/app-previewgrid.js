/** @jsx React.DOM */
"use strict";

var React = require("react");
var PureRenderMixin = require("react/addons").addons.PureRenderMixin;

var Config = require("../../config/app-config-client");

var HelpersMixin = require("../../mixins/HelpersMixin");

var ImgPrev = require("./app-imgprev");

var PreviewGrid =
  React.createClass({
    displayName: "PreviewGrid",

    propTypes: {
      url: React.PropTypes.string.isRequired,
      callback: React.PropTypes.func.isRequired
    },

    mixins: [PureRenderMixin, HelpersMixin],

    getInitialState: function() {
      return {"url": this.props.url, "photos": []};
    },

    componentWillReceiveProps: function(nextProps) {
      if(this.state.url !== nextProps.url) {
        this.setState({"url": nextProps.url});
      }
    },

    getDefaultProps: function() {
      return {
        url: "",
        photos: []
      };
    },

    handleClick: function() {
      var url = this.state.url;
      $.getJSON(Config.proxyHostUrl + "http://ajax.googleapis.com/ajax/services/search/images?v=1.0&q=" + encodeURIComponent(url), function(result) {
        if(result && result.responseData) {
          var photos = result.responseData.results;
          this.setState({photos: photos});
        }
      }.bind(this));
    },

    callback: function(item) {
      this.props.callback({
        title: item.title,
        imageUrl: item.imageUrl
      });
    },

    renderPhotos: function() {
      var self = this;
      var itms = this.state.photos;
      return itms.map(function (item) {
        return (
          <li>
            <ImgPrev title={item.contentNoFormatting} image={item.tbUrl} imageUrl={item.unescapedUrl} callback={self.callback}/>
          </li>
        );
      });
    },

    render: function() {
      return (
        <div>
          <button type="button" ref="link" onClick={this.handleClick} className="btn btn-default" disabled={!this.state.url.length}>Find images...</button>
          <div className={ this.state.photos.length ? "row" : "hidden" }>
            <div className="col-xs-12">
              <ul className="list-unstyled list-inline list-img-prev bt10">
                {this.renderPhotos()}
              </ul>
            </div>
          </div>
        </div>
        );
    }
  });

module.exports = PreviewGrid;
