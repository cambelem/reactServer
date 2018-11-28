import React, { Component } from "react";
//import { Connector } from 'mqtt-react';
//import PostMqtt from './components/PostMessage.jsx';
//import SubMqtt from './components/MessageList.jsx';

// import _MessageContainer from './components/MessageContainer.jsx';
import StartMessage from './components/StartMessage'
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
                  msgInput: "",
                  subTextBox: "",
                  pubTextBox: "",
                  ddTopic: "Topic",
                  client: mqtt.connect('ws://localhost:9001')}

    this.handleTopic = this.handleTopic.bind(this)
    this.handleMsg = this.handleMsg.bind(this)
    this.addTopic = this.addTopic.bind(this)
    this.appendSubText = this.appendSubText.bind(this)
    this.addMsg = this.addMsg.bind(this)
    this.handleTopicHeader = this.handleTopicHeader.bind(this)

    this.handleInactive = this.handleInactive.bind(this)
    this.handleActive = this.handleActive.bind(this)
    this.handleMoveAllInactive = this.handleMoveAllInactive.bind(this)
    this.handleMoveAllActive = this.handleMoveAllActive.bind(this)
  }


  handleTopic(e) {
    this.setState({topicInput: e.target.value})
  }

  handleMsg(e) {
    this.setState({msgInput: e.target.value})
  }

  addTopic() {
    let copy = this.state.activeTopic
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

  appendPubText() {
    let str = "date: " + Date.now() + " topic: " + this.state.ddTopic + " - " + this.state.msgInput
    if (this.state.pubTextBox === ""){
      this.setState({pubTextBox: str})
    } else {
      let copy = this.state.pubTextBox
      let newline = String.fromCharCode(13, 10)
      this.setState({pubTextBox: copy.concat(newline, str)})
    }
  }

  addMsg(){
    this.state.client.publish(this.state.ddTopic, this.state.msgInput)
    this.appendPubText()
    this.setState({msgInput: ""})
  }

  handleTopicHeader(e){
    this.setState({ddTopic: e.target.value})
  }


  handleInactive(topics){
    let self = this
    var value = [], index;
    let act = self.state.activeTopic
    let inact = self.state.inactiveTopic.concat(topics)
    for (var i = 0, l = topics.length; i < l; i++) {
      index = act.indexOf(topics[i]);
      if (index > -1) {
        act.splice(index, 1);
      }
    }

    this.setState({activeTopic: act,
                  inactiveTopic: inact}, () => {

                  topics.map( function(topicName) {
                            self.state.client.unsubscribe(topicName)
                          });
                  })
  }

  handleActive(topics){
    let self = this
    var value = [], index;
    let act = self.state.activeTopic.concat(topics)
    let inact = self.state.inactiveTopic
    for (var i = 0, l = topics.length; i < l; i++) {
      index = inact.indexOf(topics[i]);
      if (index > -1) {
        inact.splice(index, 1);
      }
    }

    this.setState({activeTopic: act,
                  inactiveTopic: inact}, () => {

                  topics.map( function(topicName) {
                            self.state.client.subscribe(topicName)
                          });
                  })
  }

  handleMoveAllInactive(){
    let self = this
    let inact = this.state.inactiveTopic.concat(this.state.activeTopic)
    this.setState({activeTopic: [],
                  inactiveTopic: inact}, () => {

                  self.state.inactiveTopic.map( function(topicName) {
                            self.state.client.unsubscribe(topicName)
                          });
                  })


  }

  handleMoveAllActive(){
    let self = this
    let act = this.state.activeTopic.concat(this.state.inactiveTopic)
    this.setState({activeTopic: act,
                  inactiveTopic: []}, () => {

                    self.state.activeTopic.map( function(topicName) {
                              self.state.client.subscribe(topicName)
                            });
                  })
  }

  render(){
    let message, ddItems

    if (this.state.activeTopic.length !== 0 || this.state.inactiveTopic.length !== 0){
      let self = this
      message = <StartMessage client={this.state.client} appendSubText={this.appendSubText} />

      ddItems = this.state.activeTopic.concat(this.state.inactiveTopic).map( function(topicName) {
                return <button className="dropdown-item" type="button" key={topicName} value={topicName} onClick={self.handleTopicHeader}>{topicName}</button>
              });
    } else {
      message = <div className="d-flex justify-content-center">
                  <span className="alert alert-primary">
                    No subscribers available, please add one below
                  </span>
                </div>

      ddItems = <button className="dropdown-item" type="button">Empty</button>

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
              readOnly value={this.state.pubTextBox} />
          </div>

          <div className="col-6">
            <textarea className="form-control" id="subscriberText" rows="10"
              readOnly value={this.state.subTextBox} />
          </div>
        </div>

        <br />
        {message}


        <AddRemoveTopics activeTopics   = {this.state.activeTopic}
                         inactiveTopics = {this.state.inactiveTopic}
                         handleInactive = {this.handleInactive}
                         handleActive   = {this.handleActive}
                         handleMoveAllInactive = {this.handleMoveAllInactive}
                         handleMoveAllActive   = {this.handleMoveAllActive} />
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
              <button className="btn btn-outline-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{this.state.ddTopic}</button>
              <div className="dropdown-menu">
                {ddItems}
              </div>
            </div>
            <input className="form-control" type="text" onChange={this.handleMsg} value={this.state.msgInput}/>
            <div className="input-group-append">
              <button className="btn btn-primary" onClick={this.addMsg}> Send </button>
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
