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

function getCurrentUser(component) {
  return {};
}

var UploadFile =
  React.createClass({
    modelState: ['item'],
    mixins: [StoreWatchMixin(getCurrentUser), Navigatable, events("updateHeaderView")],

    getInitialState: function() {
      return {user: {}, password: ''};
    },

    fetchData: function() {
      return true;
    },

    onChange: function(e) {
      this.setState({password: e.target.value});
    },

    upload: function() {
      var fileUploadControl = this.refs.profilePhotoFileUpload.getDOMNode();//;
      console.log('fileUploadControl', fileUploadControl);
      // if(!username||!password) return;
      var self = this;

      if (fileUploadControl.files.length > 0) {
        var file = fileUploadControl.files[0];
        // console.log('file', file);
        var ts = Math.floor(Date.now() / 1000);
        var name = "photo_" + ts.toString() + ".jpg";
        // alert('file is ok');
        var parseFile = new Parse.File(name, file);
        parseFile.save().then(function() {
          // The file has been saved to Parse.
          // jobApplication.set("applicantResumeFile", parseFile);
          // var profilePhoto = profile.get("photoFile");
          // $("profileImg")[0].src = profilePhoto.url();
          alert('saved');
        }, function(error) {
          // The file either could not be read, or could not be saved to Parse.
        });
      } else {
        alert('no file');
      }

      // Parse.User.logIn(username, password, {
      //   success: function(user) {
      //     console.log('LOGGED IN', user);
      //     AppStore.setPassword(password);
      //     self.emitUpdateHeaderView();
      //     self.navigate('/');
      //     // Do stuff after successful login.
      //   },
      //   error: function(user, error) {
      //     alert("Error: " + error.code + " " + error.message);
      //     // The login failed. Check error to see why.
      //   }
      // });

    },

    render:function(){
        return (
          <div className="col-xs-6 col-xs-push-3">
            <h2>Upload file</h2>
            <form className="form" encType="multipart/form-data">
              <div className="form-group">
                <label htmlFor="exampleInputEmail1">Select file</label>
                <input type="file" id="profilePhotoFileUpload" ref="profilePhotoFileUpload" />
              </div>
              <div className="form-group">
                <input type="button" className="btn btn-default" onClick={this.upload} value="Save..." />
              </div>
            </form>
          </div>
          );
    }
  });
module.exports = UploadFile;