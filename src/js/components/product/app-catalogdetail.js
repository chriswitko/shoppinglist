/** @jsx React.DOM */
var React = require('react');
var AppStore = require('../../stores/app-store.js');
var AddToCart = require('../catalog/app-addtocart.js');
var StoreWatchMixin = require('../../mixins/StoreWatchMixin.js');
var Link = require('react-router-component').Link;
var FetchingMixin = require('../../mixins/FetchingMixin.js');
var Item = require('../../data/item.js');
var Parse = require('parse').Parse;
var Navigatable = require('react-router-component').NavigatableMixin
var events = require('../../mixins/react-event-emitter.js');

function getCatalogItem(component) {
  var thisItem;
  // AppStore.getCatalog().forEach(function(item) {
  //   console.log('item', item);
  //   if(item.get('idx').toString() === component.props.item) {
  //     thisItem = item;
  //   }
  // });
  // return {item: thisItem};
  return {};
}

var CatalogDetail =
  React.createClass({
    modelState: ['item', 'items'],
    mixins: [FetchingMixin, StoreWatchMixin(getCatalogItem), Navigatable, events("logout")],

    getInitialState: function() {
      return {item: {}, modalShown: false};
    },

    fetchData: function() {
      Item.getByPageName(
        this.props.item,
        this.props.children,
        this.stateSetter('item')
      )

      // Item.getAll(this.stateSetter('items'));

      return true;
    },

    updateTitle: function() {
      this.state.item.set('title', 'Product Classic');
      this.state.item.save(null, {
        success: function() {
          // this.setState({loading: false});
          // Parse.history.navigate('#/pages/' + this.props.name, {trigger: true});
        }.bind(this),

        error: function(obj, error) {
          console.error('Error saving', obj, error);
        }
      });
    },

    deleteItem: function() {
      this.state.item.destroy({
        success: function() {
          // this.setState({loading: false});
          // Parse.history.navigate('/', {trigger: true});
          AppStore.setPleaseRefresh(true);
          this.navigate('/');
        }.bind(this),
        error: function(obj, error) {
          console.error('Error destroying', obj, error);
        }
      });
    },

    render:function(){
      if(this.state.item&&this.state.item.attributes) {
        // this.state.item = this.state.item.models[0];
        return (
          <div>
            <h2>{this.state.item.get('title')}</h2>
            <img src={this.state.item.get('img')} className="img-responsive"/>
            <p>{this.state.item.get('description')}</p>
            <p>${this.state.item.get('cost')} <span className="text-success">{this.state.item.get('inCart') && '(' + this.state.item.get('qty') + ' in cart)'}</span></p>
            <div className="btn-group btn-group-sm">
              <AddToCart item={this.state.item.attributes} />
              <Link href={"/"} className="btn btn-default">Continue shopping</Link>
              <input type="button" className="btn btn-default" onClick={this.updateTitle} value="Update Title" />
              <input type="button" className="btn btn-default" onClick={this.deleteItem} value="Delete" />
            </div>
          </div>
          );
      } else {
        return (
          <div>Please wait...</div>
          )
      }
    }
  });
module.exports = CatalogDetail;