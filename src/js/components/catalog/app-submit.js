/** @jsx React.DOM */
var React = require('react');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;

var AppActions = require('../../actions/app-actions.js');
var AppStore = require('../../stores/app-store.js');

var StoreWatchMixin = require('../../mixins/StoreWatchMixin.js');
var Navigatable = require('react-router-component').NavigatableMixin
var events = require('../../mixins/react-event-emitter.js');

var Alert = require('react-bootstrap').Alert;

function getCurrentUser(component) {
  return {};
}

var WishSubmit =
  React.createClass({
    mixins: [PureRenderMixin, StoreWatchMixin(getCurrentUser), Navigatable, events("authed")],//events("updateHeaderView"),

    getInitialState: function() {
      return {error: false};
    },

    submit: function() {
      AppActions.submit(this, function() {
        location = '/';
      });
    },

    render:function(){
      return (
        <div className="row">
          <div className="col-xs-12 col-lg-6 col-md-6 col-sm-6">
            <h3>Submit new link</h3>
            { this.state.error ? <Alert bsStyle="warning"><strong>Error</strong> All fields are required.</Alert> : null }
            <form className="form" encType="multipart/form-data">
              <div className="form-group">
                <label htmlFor="exampleInputEmail1">URL</label>
                <input type="text" className="form-control" id="url" ref="url" value={null} placeholder="Enter URL address" autoFocus="true" />
              </div>
              <div className="form-group">
                <label htmlFor="exampleInputEmail1">Title</label>
                <input type="text" className="form-control" id="title" ref="title" value={null} placeholder="Enter Title" />
              </div>
              <div className="form-group">
                <label htmlFor="exampleInputEmail1">Select image file...</label>
                <input type="file" className="form-control" id="image" ref="image" />
              </div>
              <div className="form-group">
                <input type="button" className="btn btn-success" onClick={this.submit} value="Submit..." />
              </div>
            </form>
          </div>
          <div className="hidden-xs col-lg-8 col-md-8 col-sm-8"></div>
        </div>
      );
    }
  });

module.exports = WishSubmit;