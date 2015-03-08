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

var Faved =
  React.createClass({

    mixins: [PureRenderMixin],

    getInitialState: function() {
      return {items: AppStore.getFavedCatalog(), modalShown: false, page: 1, hasMore: true, shouldUpdate: false};
    },

    componentWillMount:function(){
      AppStore.addChangeListener(this._onChange);
    },

    componentWillUnmount:function(){
      AppStore.removeChangeListener(this._onChange);
    },

    _onChange:function(){
      this.setState({items:AppStore.getFavedCatalog(), shouldUpdate: true});
    },

    componentDidMount: function() {
      this._loadMoreWishes(1, true);
    },

    componentDidUpdate: function() {
      this.state.shouldUpdate = false;
    },

    _includeLoadedArticles: function(page, wishes) {
      var dataset = page>1 ? AppStore.getFavedCatalog() : [];
      var catalog = dataset.concat(wishes);

      AppStore.setFavedCatalog(catalog);
      this.setState({'items': AppStore.getFavedCatalog(), 'page': page + 1, 'hasMore': wishes.length == perPage});
    },

    _loadMoreWishes: function(page) {
      AppStore.fetchMoreFavedWishes(page, function(wishes) {
        this._includeLoadedArticles(page, wishes);
      }.bind(this));
    },

    _getArticlesToRender: function () {
      var itms = AppStore.getFavedCatalog();
      return itms.map(function (item, index) {
        return (
            <CatalogItem item={item} idx={index} />
        );
      });
    },

    render: function() {
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

module.exports = Faved;