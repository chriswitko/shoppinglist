/** @jsx React.DOM */
"use strict";

var React = require("react");
var PureRenderMixin = require("react/addons").addons.PureRenderMixin;

var AppStore = require("../../stores/app-store");

var CatalogItem = require("./app-catalogitem");
var BtnMore = require("./app-btnmore");

var page = 1;
var perPage = 48;

var Faved =
  React.createClass({
    displayName: "Faved",

    mixins: [PureRenderMixin],

    getInitialState: function() {
      return {items: AppStore.getFavedCatalog(), modalShown: false, page: 1, hasMore: true, shouldUpdate: false};
    },

    componentWillMount: function(){
      AppStore.addChangeListener(this.onChange);
    },

    componentWillUnmount: function(){
      AppStore.removeChangeListener(this.onChange);
    },

    onChange: function(){
      this.setState({items: AppStore.getFavedCatalog(), shouldUpdate: true});
    },

    componentDidMount: function() {
      this.loadMoreWishes(1, true);
    },

    componentDidUpdate: function() {
      this.state.shouldUpdate = false;
    },

    includeLoadedArticles: function(wishes) {
      var dataset = page > 1 ? AppStore.getFavedCatalog() : [];
      var catalog = dataset.concat(wishes);

      AppStore.setFavedCatalog(catalog);
      this.setState({"items": AppStore.getFavedCatalog(), "page": page + 1, "hasMore": wishes.length === perPage});
    },

    loadMoreWishes: function() {
      AppStore.fetchMoreFavedWishes(function(wishes) {
        this.includeLoadedArticles(wishes);
      }.bind(this));
    },

    getArticlesToRender: function () {
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
            {this.getArticlesToRender()}
          </div>
          <div className={ this.state.hasMore ? "row ac mt10" : "hidden" }>
            <BtnMore callback={this.moreWishes}/>
          </div>
        </div>
      );
    }
  });

module.exports = Faved;
