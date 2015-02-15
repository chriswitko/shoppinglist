/** @jsx React.DOM */
var React = require('react');
var AppStore = require('../stores/app-store.js');

var GistUser =
  React.createClass({
    getInitialState: function() {
      return {
        username: '',
        lastGistUrl: ''
      };
    },

    componentDidMount: function() {
      $.get(this.props.source, function(result) {
        var lastGist = result[0];
        if (this.isMounted()) {
          this.setState({
            username: lastGist.owner.login,
            lastGistUrl: lastGist.html_url
          });
        }
      }.bind(this));
    },

    render: function() {
      return (
        <div>
          {this.state.username} last gist is <a href={this.state.lastGistUrl}>here</a>.
        </div>
      );
    }
  });
module.exports = GistUser;