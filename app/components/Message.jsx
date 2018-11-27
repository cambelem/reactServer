import React, { Component } from 'react';

export default class Message extends Component {

  componentDidMount() {
        var self = this;
        this.props.client.on('message', function(topic, payload, packet) {
            // self.addMessage({
            //     key: Date.now(),
            //     topic: topic,
            //     payload: payload.toString()
            // });

            self.props.appendSubText("date: " + Date.now() + " topic: " + topic + " - " + payload.toString())
        });
  }

  // addMessage(msg){
  //   console.log(msg)
  // }

  render(){
    return (
        null
    )
  }
}
