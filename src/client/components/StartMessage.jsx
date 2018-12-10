import React, { Component } from 'react';

export default class StartMessage extends Component {

  // When the component is created by the DOM,
  // it will fire the below code.
  componentDidMount() {
        var self = this;
        // This.props is how you handle parent info. We pass a client object..
        // This is waiting for messages to be received and then it will append the
        // data back to the parent class (View).
        this.props.client.on('message', function(topic, payload, packet) {
            self.props.appendSubText("date: " + Date.now() + " topic: " + topic + " - " + payload.toString())
        });
  }

  render(){
    // Doesn't need to display anything.
    return (
        null
    )
  }
}
