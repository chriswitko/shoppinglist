/** @jsx React.DOM */
var React = require('react');
var AppStore = require('../../stores/app-store.js');
var AddToCart = require('./app-addtocart.js');
var CatalogItem = require('./app-catalogitem.js');
var StoreWatchMixin = require('../../mixins/StoreWatchMixin.js');
var FetchingMixin = require('../../mixins/FetchingMixin.js');
var Item = require('../../data/item.js');
var AppConstants = require('../../constants/app-constants');
var AppDispatcher = require('../../dispatchers/app-dispatcher');
var events = require('../../mixins/react-event-emitter.js');
var Parse = require('parse').Parse;
var Alert = require('react-bootstrap').Alert;

function getCatalog(cb) {
  return null;
}

var Catalog =
  React.createClass({
    modelState: ['items'],
    // fetchPollInterval: 2000,
    pleaseRefreshMe: false,

    mixins: [FetchingMixin, StoreWatchMixin(getCatalog), events("logout")],//StoreWatchMixin(getCatalog),

    getInitialState: function() {
      return {items: [], modalShown: false};
    },

    shouldComponentUpdate: function(nextProps, nextState) {
      // TODO: return whether or not current chat thread is
      // different to former one.
      console.log('shouldComponentUpdate!!!', AppStore.getPleaseRefresh());
      if(AppStore.getPleaseRefresh()) {
        this.fetchData();
        return true;
      }
      return true;
    },

    componentDidMount: function(){
      console.log('componentDidMount!!!');
        // this.fetchData();
      // this.loadNavbarJSON();
    },


    fetchData: function() {
      Item.getAll('fetchData', this.stateSetter('items'));
      AppStore.setPleaseRefresh(false);
      return true;
    },

    // update our state when the login event is emitted
    onLogout: function(){
      var self = this;
      console.log('EMITTED LOGOUT EVENT');
      AppStore.setPleaseRefresh(true);
    },

    render:function(){
      if (this.state.items&&this.state.items.models) {
        var items = this.state.items.models.map(function(item){
          return <CatalogItem item={item} />
        })
      }
      return (
          <div className="row">
          <Alert bsStyle="warning">
            <strong>Holy guacamole!</strong> Best check yo self, youre not looking too good.
          </Alert>
          {items}
          </div>
        )
    }
  });
module.exports = Catalog;