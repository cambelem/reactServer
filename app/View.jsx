import React, { Component } from "react";
//import { Connector } from 'mqtt-react';
//import PostMqtt from './components/PostMessage.jsx';
//import SubMqtt from './components/MessageList.jsx';

// import _MessageContainer from './components/MessageContainer.jsx';
import Message from './components/Message'
import AddRemoveTopics from './components/AddRemoveTopics'

// import {subscribe} from 'mqtt-react';
import mqtt from 'mqtt';

// client.on('message', function(){
//   client.subscribe("webClient");
// })

export default class View extends Component {
  constructor(){
    super()
    this.state = {activeTopic: [],
                  inactiveTopic: [],
                  topicInput: "",
                  subTextBox: "",
                  client: mqtt.connect('ws://localhost:9001')}

    this.handleTopic = this.handleTopic.bind(this)
    this.addTopic = this.addTopic.bind(this)
    this.appendSubText = this.appendSubText.bind(this)
  }


  handleTopic(e) {
    this.setState({topicInput: e.target.value})
  }

  addTopic() {
    let copy = this.state.activeTopic
    console.log(this.state.topicInput);
    if (copy.includes(this.state.topicInput) ||
        this.state.inactiveTopic.includes(this.state.topicInput) ||
        this.state.topicInput === "" || this.state.topicInput === " "){
      return
    }

    copy.push(this.state.topicInput)
    this.setState({activeTopic: copy, topicInput: ""})
    this.state.client.subscribe(this.state.topicInput);
  }

  appendSubText(data) {
    if (this.state.subTextBox === ""){
      this.setState({subTextBox: data})
    } else {
      let copy = this.state.subTextBox
      let newline = String.fromCharCode(13, 10)
      this.setState({subTextBox: copy.concat(newline, data)})
    }
  }

  render(){
    let message

    if (this.state.activeTopic.length !== 0){
      message = <Message client={this.state.client} appendSubText={this.appendSubText} />
    } else {
      message = <div className="d-flex justify-content-center">
                  No subscribers available, please add one below..
                </div>


    }

    return(
      <div className="App container">
        <div className="row">
          <div className="col-12">
          <h1> Mqtt React Web Client </h1>
          </div>
        </div>

        <br />

        <div className="row">
          <div className="col-6">
            <textarea className="form-control" id="subscriberText" rows="10"
              readOnly value={this.state.subTextBox} />
          </div>

          <div className="col-6">
            <textarea className="form-control" id="subscriberText" rows="10"
              readOnly value={this.state.subTextBox} />
          </div>
        </div>

        <br />
        {message}


        <AddRemoveTopics activeTopics={this.state.activeTopic}/>
        <br />

        <div className="row">
          <div className="col-6">
            <label> Send a message below: </label>
          </div>
          <div className="col-6">
            <label> Add a topic: </label>
          </div>
          <div className="input-group mb-3 col-6">
            <div className="input-group-prepend">
              <button className="btn btn-outline-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Topic</button>
              <div className="dropdown-menu">
                <a className="dropdown-item" href="#">Action</a>
                <a className="dropdown-item" href="#">Action2</a>
              </div>
            </div>
            <input className="form-control" type="text" onChange={this.handleTopic} value={this.state.topicInput}/>
            <div className="input-group-append">
              <button className="btn btn-primary" onClick={this.addTopic}> Send </button>
            </div>
          </div>
          <div className="input-group mb-3 col-6">
            <input className="form-control" type="text" onChange={this.handleTopic} value={this.state.topicInput}/>
            <div className="input-group-append">
              <button className="btn btn-primary" onClick={this.addTopic}> Subscribe To Topic </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
};
