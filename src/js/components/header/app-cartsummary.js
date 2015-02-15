/** @jsx React.DOM */
var React = require('react');
var Link = require('react-router-component').Link;
var AppStore = require('../../stores/app-store.js');
var StoreWatchMixin = require('../../mixins/StoreWatchMixin.js');
var Item = require('../../data/item.js');
var Navigatable = require('react-router-component').NavigatableMixin
var AppActions = require('../../actions/app-actions.js');
var events = require('../../mixins/react-event-emitter.js');
var Parse = require('parse').Parse;
var FetchingMixin = require('../../mixins/FetchingMixin.js');
var Wish = require('../../data/wish.js');
var Button = require('react-bootstrap').Button;

function CartTotals() {
  return AppStore.getCartTotals();
}


var CartSummary =
  React.createClass({
    mixins: [StoreWatchMixin(CartTotals), Navigatable, events("updateHeaderView")],

    // getInitialState: function() {
    //   return {user: AppStore.getCurrentUser()};
    // },

    componentWillMount: function() {
      this.updateHeaderView();
    },

    updateHeaderView: function() {
      var registerBtn = <Link href="/register" className="btn btn-danger">Register</Link>
      var loginBtn = <Link href="/login" className="btn btn-default">Login</Link>
      var getWishesBtn = <input type="button" className="btn btn-default" onClick={this.getWishes} value="GetWishes" />
      if(AppStore.getCurrentUser()) registerBtn = <Button bsStyle="default" onClick={this.logOut}>Logout</Button>
      if(AppStore.getCurrentUser()) loginBtn = '';
      if(!AppStore.getCurrentUser()) getWishesBtn = '';
      this.setState({'registerBtn': registerBtn, 'loginBtn': loginBtn, 'getWishesBtn': getWishesBtn});
    },

    onUpdateHeaderView: function() {
      this.updateHeaderView();
    },

    addNewItem: function() {
      var self = this;
      var price = Math.floor(Math.random() * 6) + 1;
      var idx = Math.floor(Date.now() / 1000);
      AppStore.setPleaseRefresh(true);

      Wish.createByObject({
        'idx': 'Widget' + idx.toString(),
        'title': 'Widget title ' + idx.toString(),
        'summary': 'This is an awesome widget!',
        'description': 'Lorem ipsum awesome widget',
        'img': 'http://lorempixel.com/100/100/',
        'cost': price
      }, function() {
        console.log('DATA READY 000');
        self.emitLogout();
      });

      // this.navigate('/?t='+idx.toString());
      // location = '/';
    },

    logOut: function() {
      Parse.User.logOut();
      this.updateHeaderView();
      // this.navigate('/');
    },

    getWishes: function() {
      var self = this;
      $.get('https://api.szopuje.pl/api/v2/users/chriswitko/wishes', function(result) {
        var lastWish = result.wishes[0].wish;
        console.log('WISH', lastWish);
        var user = AppStore.getCurrentUser();
        var totalItems = result.pagination.total;
        var countItems = 0;
        var totalPages = result.pagination.pages;

        for(var p=1;p<=totalPages;p++) {
          $.get('https://api.szopuje.pl/api/v2/users/chriswitko/wishes', function(result) {
            result.wishes.forEach(function(wish) {
              countItems++;
              self.setState({'countItems': countItems, 'totalItems': totalItems, 'totalPages': totalPages, 'currentPage': p});
              Wish.createByObject({
                'url': wish.wish.url,
                'title': wish.wish.title,
                'description': wish.wish.description,
                'user': user,
                'img': wish.wish.finalImage
              }, function() {
                console.log('DATA SAVED');
                // self.emitLogout();
              });
            })
          });
        }
        // https://szopuje.s3-eu-west-1.amazonaws.com/detail_1412073904494.jpg

        // console.log('url', lastWish.url);

        // user.set("imported", 1);
        // user.save(null, {
          // success: function(user) {
            // return user;
          // },
          // error: function(user, error) {
            // console.log('user update error', error);
          // }
        // });
      }.bind(this));
    },

    render:function(){

      return (
        <div>
          <input type="button" className="btn btn-default" value="Create" onClick={this.addNewItem} />
          <Link href="/cart" className="btn btn-success">
            Cart Items: {this.state.qty} / ${this.state.total}
          </Link>
          {this.state.registerBtn}{this.state.loginBtn}
          {this.state.getWishesBtn} {this.state.countItems} / {this.state.totalItems}
          <Link href="/upload" className="btn btn-success">Upload file</Link>
        </div>
        )
    }
  });
module.exports = CartSummary;