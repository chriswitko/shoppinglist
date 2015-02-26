/** @jsx React.DOM */
"use strict";
var Parse = require('parse').Parse;

var APP = require('./components/app');
var React = require('react');

Parse.initialize('c3Ge9RO9ewCqsGyxvMnHTseQMFsn32qPG2gCXaB5', 'QkquMS88JO5O61Nu6DoPwnGOEECvtRKejuYwLxZ1');

React.renderComponent(<APP />, document.getElementById('main'));