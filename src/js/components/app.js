/** @jsx React.DOM */
var React = require('react');
var Catalog = require('../components/catalog/app-catalog.js');
var CatalogDetail = require('../components/product/app-catalogdetail.js');
var Template = require('../components/app-template.js');
var Cart = require('../components/cart/app-cart.js');
var Test = require('../components/cart/app-test.js');
var GistUser = require('../components/app-gist.js');
var Router = require('react-router-component');
var Register = require('../components/user/app-register.js');
var Login = require('../components/user/app-login.js');
var UploadFile = require('../components/file/app-upload.js');

var Locations = Router.Locations;
var Location = Router.Location;

//http://react-bootstrap.github.io/components.html#modals
//http://prometheusresearch.github.io/react-forms/examples/family-editor.html
//http://blog.vullum.io/react-masonry-mixin/
//https://www.npmjs.com/package/react-packery-mixin
//http://mosch.github.io/react-avatar-editor/
//https://github.com/STRML/react-grid-layout#demos
//http://react.rocks/

var APP =
  React.createClass({
    render: function(){
      return (
        <Template>
          <Locations>
            <Location path="/" handler={Catalog} />
            <Location path="/test" handler={Test} />
            <Location path="/cart" handler={Cart} />
            <Location path="/item/:item" handler={CatalogDetail} />
            <Location path="/register" handler={Register} />
            <Location path="/login" handler={Login} />
            <Location path="/upload" handler={UploadFile} />
          </Locations>
        </Template>
        )
    }
  });
module.exports = APP;
