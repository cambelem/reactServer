import React, { Component } from 'react';
import { subscribe } from 'mqtt-react';

export class PostMessage extends Component {

  sendMessage(e) {
    e.preventDefault();
    const { mqtt } = this.props;
    mqtt.publish('webClient', 'Hello World!');
  }

  render() {
    return (
      <button onClick={this.sendMessage.bind(this)}>
        Send Message
      </button>
    );
  }
}

export default subscribe({
  topic: 'webClient'
})(PostMessage)
