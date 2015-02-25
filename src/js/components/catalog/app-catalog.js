/** @jsx React.DOM */
var React = require('react');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;

var AppStore = require('../../stores/app-store.js');
var CatalogItem = require('./app-catalogitem.js');
var StoreWatchMixin = require('../../mixins/StoreWatchMixin.js');
var FetchingMixin = require('../../mixins/FetchingMixin.js');
var Wish = require('../../data/wish.js');
var events = require('../../mixins/react-event-emitter.js');
var Parse = require('parse').Parse;
var Alert = require('react-bootstrap').Alert;

var MasonryMixin = require('react-masonry-mixin');
var InfiniteScroll = require('react-infinite-scroll')(React);

var masonryOptions = {
    transitionDuration: 0
};

var page = 0;
var perPage = 50;

function getCatalog(cb) {
  return {items: AppStore.getCatalog(), modalShown: false, page: 1, hasMore: true, sholdUpdate: false};
}

var Catalog =
  React.createClass({
    mixins: [PureRenderMixin, StoreWatchMixin(getCatalog), events("logout"), events("removeItem"), MasonryMixin('masonryContainer', masonryOptions)],//StoreWatchMixin(getCatalog),, FetchingMixin

    onRemoveItem: function(item) {
      var self = this;
      if(this.isMounted()) this.forceUpdate();
    },

    onLogout: function(){
      var self = this;
      // AppStore.setPleaseRefresh(true);
      // if(this.isMounted()) this.setState({'sholdUpdate': new Date()})
    },

    includeLoadedArticles: function(page, wishes) {
      var par = AppStore.getCatalog();
      var catalog = par.concat(wishes);//HelpersMixin.createUniqueArray(par.concat(wishes), 'id');
      AppStore.setCatalog(catalog);
      if(this.isMounted()) this.setState({'items': catalog, 'page': page + 1, 'hasMore': wishes.length == perPage});
    },

    loadMoreWishes: function(page) {
      this.fetchMoreWishes(page, function(wishes) {
        this.includeLoadedArticles(page, wishes);
      }.bind(this));
    },

    fetchMoreWishes: function(page, callback) {
      var self = this;
      Wish.getAll('fetchData', page, perPage, AppStore.getCurrentUser(), function(wishes) {
        var its = wishes.models.map(function(item){
          return item;
        })

        callback(its);
      }.bind(this));
    },

    getArticlesToRender: function () {
      var itms = AppStore.getCatalog();
      return itms.map(function (item, index) {
        return (
            <CatalogItem item={item} idx={index} />
        );
      });
    },

    render:function(){
      return (
        <div className="row">
          <InfiniteScroll ref='masonryContainer' id='masonryContainer' pageStart={this.state.page - 1} loadMore={this.loadMoreWishes} hasMore={this.state.hasMore} threshold={1000}>
            {this.getArticlesToRender()}
          </InfiniteScroll>
        </div>
      )
    }
  });
module.exports = Catalog;