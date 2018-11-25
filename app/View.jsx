import React, { Component } from "react";
import { Connector } from 'mqtt-react';
//import PostMqtt from './components/PostMessage.jsx';
//import SubMqtt from './components/MessageList.jsx';

import _MessageContainer from './components/MessageContainer.jsx';
import {subscribe} from 'mqtt-react';

export default class View extends Component {
  constructor(){
    super()
    this.state = {msgArray: [],
                  topicInput: "",
                  subTextBox: ""}

    this.handleTopic = this.handleTopic.bind(this)
    this.addTopic = this.addTopic.bind(this)
    this.appendSubText = this.appendSubText.bind(this)
    this.testBtn = this.testBtn.bind(this)
  }

  handleTopic(e) {
    console.log(e.target.value)
    this.setState({topicInput: e.target.value})
  }

  addTopic() {
    let copy = this.state.msgArray
    copy.push(this.state.topicInput)
    this.setState({msgArray: copy, topicInput: ""})
    
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

  testBtn(e) {
    if (this.state.subTextBox === ""){
      this.setState({subTextBox: e.target.value})
    } else {
      let copy = this.state.subTextBox
      let newline = String.fromCharCode(13, 10)
      this.setState({subTextBox: copy.concat(newline, e.target.value)})
    }
  }

  render(){
    const topicInputBox = <div>
                          <div className="row">
                            <div className="col-12">
                              <label> Please add a topic  below: </label>
                            </div>
                          </div>
                          <div className="row">
                          <div className="input-group mb-3 col-6">
                            <input className="form-control" type="text" onChange={this.handleTopic} />
                            <div className="input-group-append">
                              <button className="btn btn-primary" onClick={this.addTopic}> Add Topic </button>
                            </div>
                          </div>
                          </div>
                          </div>

    //let msgArray = ["webClient", "sensor"]
    let message
    let subText
    let test
    if (this.state.msgArray.length !== 0){
      console.log(this.state.msgArray)
      message = this.state.msgArray.map( topicName => {
                let Container = subscribe({topic: topicName})(_MessageContainer)
 
                return (
                  <Connector key={topicName} mqttProps="ws://localhost:9001"> 
                    <Container key={topicName} appendSubText={this.appendSubText} />
                  </Connector>
                )
              }
            )
      subText = <textarea className="form-control" id="subscriberText" rows="10" readOnly value={this.state.subTextBox}></textarea>
      //test = <button className="btn btn-primary" onClick={this.testBtn} value="test" >Add Test</button>
    } else {
      message = "No subscribers available, please add one below.."
      let subText = null 
      //let test = null
    }
    return(
      <div className="App container">
        <div className="row">
          <div className="col-12">
          <h1> Mqtt React Web Client </h1>
          </div>
        </div>

        {message}
        {subText}
        <br />
        <br />

        {topicInputBox}

      </div>
    )
  }
};
