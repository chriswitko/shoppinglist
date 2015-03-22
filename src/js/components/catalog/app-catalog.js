/** @jsx React.DOM */
"use strict";

var React = require("react");
var PureRenderMixin = require("react/addons").addons.PureRenderMixin;

var AppStore = require("../../stores/app-store");

var Wish = require("../../data/wish");

var CatalogItem = require("./app-catalogitem");
var BtnMore = require("./app-btnmore");

var page = 1;
var perPage = 48;

var Catalog =
  React.createClass({
    displayName: "Catalog",

    mixins: [PureRenderMixin],

    getInitialState: function(){
      return {items: AppStore.getCatalog(), page: 1, hasMore: true, shouldUpdate: false};
    },

    getDefaultProps: function() {},

    componentWillMount: function(){
      AppStore.addChangeListener(this.onChange);
    },

    componentWillUnmount: function(){
      AppStore.removeChangeListener(this.onChange);
    },

    onChange: function(){
      this.setState({shouldUpdate: true});
    },

    componentDidMount: function() {
      if(!this.state.items.length) {
        this.loadMoreWishes(1, true);
      // } else {
        // this.setState({items: AppStore.getCatalog()});
      }
    },

    componentDidUpdate: function() {
      this.state.shouldUpdate = false;
    },

    onDatasetUpdate: function() {
      this.state.items = AppStore.getCatalog();
    },

    includeLoadedArticles: function(wishes) {
      var dataset = AppStore.getCatalog();
      var catalog = dataset.concat(wishes);

      AppStore.setCatalog(catalog);
      this.setState({"items": AppStore.getCatalog(), "page": page + 1, "hasMore": wishes.length === perPage});
    },

    loadMoreWishes: function() {
      this.fetchMoreWishes(function(wishes) {
        this.includeLoadedArticles(wishes);
      }.bind(this));
    },

    fetchMoreWishes: function(callback) {
      Wish.getAll("fetchData", page, perPage, AppStore.getCurrentUser(), function(wishes) {
        var its = wishes.models.map(function(item) {
          return item;
        });
        callback(its);
      });
    },

    getArticlesToRender: function () {
      var itms = AppStore.getCatalog();
      return itms.map(function (item, index) {
        return (
            <CatalogItem item={item} idx={index} view="catalog" />
        );
      });
    },

    moreWishes: function() {
      page++;
      this.loadMoreWishes();
    },

    render: function(){
      return (
        <div>
          <div className="row">
            {this.getArticlesToRender()}
          </div>
          <div className={ this.state.hasMore ? "row ac mt10" : "hidden" }>
            <BtnMore callback={this.moreWishes}/>
          </div>
        </div>
      );
    }
  });

module.exports = Catalog;
