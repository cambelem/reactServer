import React, { Component } from 'react';

import MessageList from './MessageList';

export default class MessageContainer extends Component {

  addMessage(message){
    message.preventDefault();
    const {mqtt} = this.props;
    mqtt.publish('webClient', "Hello World!");
  }

  render(){
    return (
      <div>
        <MessageList data={this.props.data} />
        <button onClick={this.addMessage.bind(this)}>
          Send Message
        </button>
      </div>
    )

  }

}

