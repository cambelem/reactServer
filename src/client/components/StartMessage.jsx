import React, { Component } from 'react';

export default class StartMessage extends Component {

  componentDidMount() {
        var self = this;
        this.props.client.on('message', function(topic, payload, packet) {
            self.props.appendSubText("date: " + Date.now() + " topic: " + topic + " - " + payload.toString())
        });
  }

  render(){
    return (
        null
    )
  }
}
