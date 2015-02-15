/** @jsx React.DOM */
var React = require('react');
var AddToCart = require('./app-addtocart.js');
var Link = require('react-router-component').Link;

var CatalogItem =
  React.createClass({
    render:function(){
      var itemStyle = {
        borderBottom: '1px solid #ccc',
        paddingBottom: '15px'
      };
      return (
        <div className="col-sm-3" style={itemStyle}>
          <h4>{this.props.item.get('title')}</h4>
          <img src={this.props.item.get('img')} className="img-responsive"/>
          <p>{this.props.item.get('summary')}</p>
          <p>${this.props.item.get('cost')} <span className="text-success">{this.props.item.get('inCart') && '(' + this.props.item.get('qty') + ' in cart)'}</span></p>
          <div className="btn-group btn-group-xs">
            <Link href={"/item/" + this.props.item.get('idx')} className="btn btn-default">Learn more</Link>
            <AddToCart item={this.props.item.attributes} />
          </div>
        </div>
        )
    }
  });
module.exports = CatalogItem;