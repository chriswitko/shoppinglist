/** @jsx React.DOM */
'use strict';

var React = require('react');
var Navigatable = require('react-router-component').NavigatableMixin

var AppStore = require('../../stores/app-store.js');

var Wish = require('../../data/wish.js');

var Parse = require('parse').Parse;

var Link = require('react-router-component').Link;
var Alert = require('react-bootstrap').Alert;
var ProgressBar = require('react-bootstrap').ProgressBar;

var UserSettingsImport =
  React.createClass({
    mixins: [Navigatable],

    getInitialState: function() {
      return {user: {}, username: '', error: false, percent: 0};
    },

    importFromSzopuje: function() {
      var username = this.refs.username.getDOMNode().value;

      if(!username) {
        this.setState({error: true});
        return;
      } else {
        this.setState({error: false});
      }

      $.get('https://api.szopuje.pl/api/v2/users/' + username + '/wishes', function(result) {
        var lastWish = result.wishes[0].wish;
        var user = AppStore.getCurrentUser();
        var totalItems = result.pagination.total;
        var countItems = 0, percent = 0;
        var totalPages = result.pagination.pages;

        for(var p=1;p<=totalPages;p++) {
          $.get('https://api.szopuje.pl/api/v2/users/chriswitko/wishes?page='+p, function(result) {
            result.wishes.forEach(function(wish) {
              countItems++;
              percent = Math.floor((countItems * 100)/totalItems);

              this.setState({'percent': percent, 'countItems': countItems, 'totalItems': totalItems, 'totalPages': totalPages, 'currentPage': p});

              if(wish.wish.url&&wish.wish.title) {
                Wish.createByObject({
                  'url': wish.wish.url,
                  'title': wish.wish.title,
                  'description': wish.wish.description,
                  'user': user,
                  'img': wish.wish.finalImage
                }, function() {
                });
              }
            })
          }.bind(this));
        }
      });
    },

    render: function() {
      return (
        <div className="row">
          <div className="col-xs-12">
            <h3>Import data from Szopuje.pl</h3>
            <p className="small">You can easyli import data from external sources. Below you will find supported services. Feel free to contact us if you will have questions.</p>
            { this.state.error ? <Alert bsStyle="warning"><strong>Error</strong> Please provide valid username.</Alert> : null }
            <form className="form">
              <div className="form-group">
                <label htmlFor="exampleInputEmail1">Enter username for Szopuje.pl website</label>
                <input type="text" className="form-control" id="username" ref="username" value={null} placeholder="Usename" autoFocus="true" />
              </div>
              <div className="form-group">
                <input type="button" className="btn btn-success" onClick={this.importFromSzopuje} value="Import..." />
              </div>
            </form>
            <ProgressBar bsStyle="success" now={this.state.percent} label="%(percent)s%" />
          </div>
        </div>
      );
    }
  });

module.exports = UserSettingsImport;