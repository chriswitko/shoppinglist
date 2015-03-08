/** @jsx React.DOM */
'use strict';

var React = require('react');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;

var AppStore = require('../../stores/app-store');

var Wish = require('../../data/wish');

var CatalogItem = require('./app-catalogitem');
var BtnMore = require('./app-btnmore');

var page = 1;
var perPage = 48;

var Catalog =
  React.createClass({
    mixins: [PureRenderMixin],

    getInitialState:function(){
      return {items: AppStore.getCatalog(), page: 1, hasMore: true, shouldUpdate: false};
    },

    getDefaultProps: function() {},

    componentWillMount:function(){
      AppStore.addChangeListener(this._onChange);
    },

    componentWillUnmount:function(){
      AppStore.removeChangeListener(this._onChange);
    },

    _onChange:function(){
      this.setState({shouldUpdate: true});
    },

    componentDidMount: function() {
      if(!this.state.items.length) {
        this._loadMoreWishes(1, true);
      } else {
        this.setState({items: AppStore.getCatalog()});
      }
    },

    componentDidUpdate: function() {
      this.state.shouldUpdate = false;
    },

    onDatasetUpdate: function() {
      this.state.items = AppStore.getCatalog();
    },

    _includeLoadedArticles: function(page, wishes) {
      var dataset = AppStore.getCatalog();
      var catalog = dataset.concat(wishes);

      AppStore.setCatalog(catalog);
      this.setState({'items': AppStore.getCatalog(), 'page': page + 1, 'hasMore': wishes.length == perPage});
    },

    _loadMoreWishes: function(page) {
      this._fetchMoreWishes(page, function(wishes) {
        this._includeLoadedArticles(page, wishes);
      }.bind(this));
    },

    _fetchMoreWishes: function(page, callback) {
      Wish.getAll('fetchData', page, perPage, AppStore.getCurrentUser(), function(wishes) {
        var its = wishes.models.map(function(item) {
          return item;
        })
        callback(its);
      }.bind(this));
    },

    _getArticlesToRender: function () {
      var itms = AppStore.getCatalog();
      return itms.map(function (item, index) {
        return (
            <CatalogItem item={item} idx={index} view='catalog' />
        );
      });
    },

    _moreWishes: function() {
      page++;
      this._loadMoreWishes(page);
    },

    render:function(){
      return (
        <div>
          <div className="row">
            {this._getArticlesToRender()}
          </div>
          <div className={this.state.hasMore? 'row ac mt10' : 'hidden'}>
            <BtnMore callback={this._moreWishes}/>
          </div>
        </div>
      )
    }
  });

module.exports = Catalog;