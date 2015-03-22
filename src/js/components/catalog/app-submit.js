/** @jsx React.DOM */
"use strict";

var React = require("react");
var PureRenderMixin = require("react/addons").addons.PureRenderMixin;
var Navigatable = require("react-router-component").NavigatableMixin;

var Config = require("../../config/app-config-client");

var Parse = require("parse").Parse;

var AppStore = require("../../stores/app-store");

var Wish = require("../../data/wish.js");

var HelpersMixin = require("../../mixins/HelpersMixin");

var PreviewGrid = require("./app-previewgrid");
var Alert = require("react-bootstrap").Alert;

var WishSubmit =
  React.createClass({
    displayName: "WishSubmit",

    mixins: [PureRenderMixin, Navigatable, HelpersMixin],

    getInitialState: function() {
      return {error: false, title: "", url: "", imageUrl: ""};
    },

    handleClick: function(evt) {
      this.setState({title: evt.target.value});
    },

    handleClickUrl: function(evt) {
      this.setState({url: evt.target.value});
    },

    handleClickImageUrl: function(evt) {
      this.setState({imageUrl: evt.target.value});
    },

    submit: function() {
      var url = this.refs.url.getDOMNode().value;
      var title = this.refs.title.getDOMNode().value;
      var imageUrl = this.refs.imageUrl.getDOMNode().value;
      var image = this.refs.image.getDOMNode();
      if(!image.files.length && !imageUrl) {
        return;
      }

      var ts = Math.floor(Date.now() / 1000);
      var name = "photo_" + ts.toString() + ".jpg";

      var parseFile;

      if (image.files.length > 0) {
        var file = image.files[0];
        parseFile = new Parse.File(name, file);
        parseFile.save().then(function() {
          Wish.createByObject({
            "url": url,
            "title": title,
            "user": AppStore.getCurrentUser(),
            "picture": parseFile
          }, function() {
            top.location = "/";
          });
        }, function() {
          // add error info
          top.location = "/";
        });
      } else {
        this.getImageAsBase64(Config.proxyHostUrl + imageUrl, function(base64) {
          parseFile = new Parse.File(name, { base64: base64 });
          parseFile.save().then(function() {
            Wish.createByObject({
              "url": url,
              "title": title,
              "user": AppStore.getCurrentUser(),
              "picture": parseFile
            }, function() {
              top.location = "/";
            });
          }, function() {
            // add error info
            top.location = "/";
          });
        });
      }
    },

    callback: function(e) {
      this.setState({title: e.title, imageUrl: e.imageUrl});
    },

    render: function(){
      return (
        <div>
          <div className="row">
            <div className="col-xs-12 col-lg-6 col-md-6 col-sm-6">
              <h3>Submit new link</h3>
              { this.state.error ? <Alert bsStyle="warning"><strong>Error</strong> All fields are required.</Alert> : null }
              <form className="form" encType="multipart/form-data">
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">URL</label>
                  <input type="text" className="form-control" id="url" ref="url" value={this.state.url} onChange={this.handleClickUrl} placeholder="Enter URL address" autoFocus="true" />
                </div>
                <div className="form-group mt10 bg-odd">
                  <PreviewGrid callback={this.callback} url={this.state.url}/>
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Title</label>
                  <input type="text" className="form-control" id="title" ref="title" value={this.state.title} onChange={this.handleClick} placeholder="Enter Title" />
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Enter image url</label>
                  <input type="text" className="form-control" id="imageUrl" ref="imageUrl" value={this.state.imageUrl} onChange={this.handleClickImageUrl} />
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">or, upload image from this device...</label>
                  <input type="file" className="form-control" id="image" ref="image" />
                </div>
                <div className="form-group">
                  <input type="button" className="btn btn-success" onClick={this.submit} value="Submit..." />
                </div>
              </form>
            </div>
            <div className="hidden-xs col-lg-8 col-md-8 col-sm-8"></div>
          </div>
        </div>
      );
    }
  });

module.exports = WishSubmit;
