import React, { Component } from "react";
import { Connector } from 'mqtt-react';
//import PostMqtt from './components/PostMessage.jsx';
//import SubMqtt from './components/MessageList.jsx';

import _MessageContainer from './components/MessageContainer.jsx';
import {subscribe} from 'mqtt-react';

const MessageContainer = subscribe({topic: 'webClient'})(_MessageContainer);

export default class View extends Component {
  constructor(){
    super()
    this.state = {}
  }
  
  render(){
    return(
      <div className="App">
        <Connector mqttProps="ws://localhost:9001">
          <MessageContainer/>
        </Connector>
        <div>
          <h1> Hello World </h1>
        </div>
      </div>
    )
  }
};
