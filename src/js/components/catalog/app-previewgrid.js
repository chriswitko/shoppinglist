/** @jsx React.DOM */
'use strict';

var React = require('react');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;

var Config = require('../../config/app-config-client');

var HelpersMixin = require('../../mixins/HelpersMixin');

var ImgPrev = require('./app-imgprev');

var PreviewGrid =
  React.createClass({
    propTypes: {
      url: React.PropTypes.string.isRequired,
      callback: React.PropTypes.func.isRequired
    },

    mixins: [PureRenderMixin, HelpersMixin],

    getInitialState: function() {
      return {'url': this.props.url, 'photos': []}
    },

    componentWillReceiveProps: function(nextProps) {
      if(this.state.url!=nextProps.url) this.setState({'url': nextProps.url});
    },

    getDefaultProps: function() {
      return {
        url: '',
        photos: []
      };
    },

    _handleClick: function() {
      var url = this.state.url;
      $.getJSON(Config.proxyHostUrl + 'http://ajax.googleapis.com/ajax/services/search/images?v=1.0&q=' + encodeURIComponent(url), function(result) {
        console.log(result);
        _photos = result.responseData.results;
        this.setState({photos: _photos});
      }.bind(this));
    },

    _callback: function(item) {
      this.props.callback({
        title: item.title,
        image_url: item.image_url
      });
    },

    _renderPhotos: function() {
      var self = this;
      var itms = this.state.photos;
      return itms.map(function (item, index) {
        return (
          <li>
            <ImgPrev title={item.contentNoFormatting} image={item.tbUrl} image_url={item.unescapedUrl} callback={self._callback}/>
          </li>
        );
      });
    },

    render: function() {
      return (
        <div>
          <button type="button" ref="link" onClick={this._handleClick} className="btn btn-default" disabled={!this.state.url.length}>Find images...</button>
          <div className={this.state.photos.length? 'row' : 'hidden'}>
            <div className="col-xs-12">
              <ul className="list-unstyled list-inline list-img-prev bt10">
                {this._renderPhotos()}
              </ul>
            </div>
          </div>
        </div>
        )
    }
  });

module.exports = PreviewGrid;