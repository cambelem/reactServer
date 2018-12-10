var React = require('react');
var ReactDOM = require('react-dom');
import View from './View';

// Beginning of the application. This calls the <View> component.
// It was place all the html and javascript into the div=app
// within the public/index.html.
ReactDOM.render(
  <View />,
  document.getElementById('app')
);
