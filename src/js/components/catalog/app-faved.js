/** @jsx React.DOM */
var React = require('react');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;

var AppStore = require('../../stores/app-store.js');
var CatalogItem = require('./app-catalogitem.js');

var Wish = require('../../data/wish.js');

var StoreWatchMixin = require('../../mixins/StoreWatchMixin.js');
var events = require('../../mixins/react-event-emitter.js');

var MasonryMixin = require('react-masonry-mixin');
var InfiniteScroll = require('react-infinite-scroll')(React);

var masonryOptions = {
    transitionDuration: 0
};

var page = 0;
var perPage = 50;

function getCatalog(cb) {
  return null;
}

var Faved =
  React.createClass({

    mixins: [PureRenderMixin, StoreWatchMixin(getCatalog), events("logout"), events("removeItem"), MasonryMixin('masonryContainer', masonryOptions)],//StoreWatchMixin(getCatalog),

    getInitialState: function() {
      return {items: [], modalShown: false, page: 1, hasMore: true, sholdUpdate: false};
    },

    onRemoveItem: function(item) {
      AppStore.setPleaseRefresh(true);
      if(this.isMounted) this.setState({'sholdUpdate': true})
    },

    onLogout: function(){
      var self = this;
      AppStore.setPleaseRefresh(true);
    },

    includeLoadedArticles: function(page, wishes) {
      var par = AppStore.getCatalog();
      var catalog = par.concat(wishes);
      AppStore.setCatalog(catalog);
      if(this.isMounted) this.setState({'items': catalog, 'page': page + 1, 'hasMore': wishes.length == perPage});
    },

    loadMoreWishes: function(page) {
      this.fetchMoreWishes(page, function(wishes) {
        this.includeLoadedArticles(page, wishes);
      }.bind(this));
    },

    fetchMoreWishes: function(page, callback) {
      var self = this;
      Wish.getFaved('fetchData', page, perPage, AppStore.getCurrentUser(), function(wishes) {
        var its = wishes.models.map(function(item){
          return item;
        })
        callback(its);
      }.bind(this));
    },

    getArticlesToRender: function () {
      return this.state.items.map(function (item, index) {
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
module.exports = Faved;