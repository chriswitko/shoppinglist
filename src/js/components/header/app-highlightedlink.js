var React = require('react')
var Router = require('react-router-component')

var HighlightedLink = React.createClass({

  mixins: [Router.NavigatableMixin],

  isActive: function() {
    return this.getPath() === this.props.href
  },

  render: function() {
    var className
    if (this.props.activeClassName && this.isActive()) {
      className = this.props.activeClassName
    }
    var link = Router.Link({className: className}, this.props.children)
    return this.transferPropsTo(link)
  }
})

module.exports = HighlightedLink;