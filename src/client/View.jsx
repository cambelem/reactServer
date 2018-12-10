import React, { Component } from "react";
import mqtt from 'mqtt';
import StartMessage from './components/StartMessage'
import AddRemoveTopics from './components/AddRemoveTopics'
import axios from "axios";

export default class View extends Component {
  constructor(){
    super()

    // These are fields used within the React App.
    // Whenever one or more of these variables are changed
    // via a setState, the app well rerender information
    this.state = {activeTopic: [],
                  inactiveTopic: [],
                  topicInput: "",
                  msgInput: "",
                  subTextBox: "",
                  pubTextBox: "",
                  ddTopic: "",
                  ddDeleteTopic: "Topic",
                  client: mqtt.connect('ws://localhost:9001')}

    // This block of function binds are needed for React
    // to find the functions and pass to children components.
    this.getTopics = this.getTopics.bind(this)
    this.saveTopic = this.saveTopic.bind(this)
    this.deleteTopic = this.deleteTopic.bind(this)

    this.handleTopic = this.handleTopic.bind(this)
    this.handleMsg = this.handleMsg.bind(this)
    this.addTopic = this.addTopic.bind(this)
    this.appendSubText = this.appendSubText.bind(this)
    this.addMsg = this.addMsg.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)
    this.handleTopicHeader = this.handleTopicHeader.bind(this)
    this.handleDeleteTopicHeader = this.handleDeleteTopicHeader.bind(this)

    this.handleInactive = this.handleInactive.bind(this)
    this.handleActive = this.handleActive.bind(this)
    this.handleMoveAllInactive = this.handleMoveAllInactive.bind(this)
    this.handleMoveAllActive = this.handleMoveAllActive.bind(this)

    this.downloadLog = this.downloadLog.bind(this)
  }

  // When View.jsx gets loaded on a page, call the getTopics function.
  componentDidMount() {
    this.getTopics()
  }

  // Grabs the json data from the data folder (topics.json)
  // by fetching via an API call.
  getTopics() {
    fetch("/api/getData")
      .then(data => data.json())
      // We are setting the state of the data from the json file.
      .then(res => this.setState({activeTopic: JSON.parse(res.data),
                                  ddTopic: JSON.parse(res.data)[0]}, () => {
        // We are create a function callback to force the state to update
        // and then we are going to subscribe to each of the topics.
        for (var i = 0; i < this.state.activeTopic.length; i++){
          this.state.client.subscribe(this.state.activeTopic[i])
        }
      }));
  }

  // Saves the topic to the json file by calling a POST request
  saveTopic(name) {
    axios.post("/api/putData", {
      topic: name,
    });
  }

  // Deletes a topic and unsubscribes the topic.
  deleteTopic() {
    if (this.state.ddDeleteItems !== "Topic"){

      this.state.client.unsubscribe(this.state.ddDeleteTopic)

      // Need to create a new variable so that an inner function
      // can still use the outer parent function
      let self = this
      axios.delete("/api/deleteData", {
        data: {
          topic: self.state.ddDeleteTopic
        }
      })
      .then(function() {
        // We might delete a function thats in an inactive state,
        // we need to remove it
        let index = self.state.inactiveTopic.indexOf(self.state.ddDeleteTopic);
        if (index > -1) {
          self.state.inactiveTopic.splice(index, 1);
        }

        // Set the state to Topic as the deleted topic is removed.
        self.setState({ddDeleteTopic: "Topic"})
        self.getTopics()
      });
    }
  }

  // event handler for a textbox
  handleTopic(e) {
    this.setState({topicInput: e.target.value})
  }

  // event handler for a textbox
  handleMsg(e) {
    this.setState({msgInput: e.target.value})
  }

  // Adds a topic via an input box and sets it to active
  // then it calls the API to save the topic to the JSON
  // file.
  addTopic() {
    let copy = this.state.activeTopic
    // Basic sanitation of the topic input. This can be done better.
    if (copy.includes(this.state.topicInput) ||
        this.state.inactiveTopic.includes(this.state.topicInput) ||
        this.state.topicInput === "" || this.state.topicInput === " "){
      return
    }

    copy.push(this.state.topicInput)
    this.saveTopic(this.state.topicInput)
    this.setState({activeTopic: copy, topicInput: ""})
    this.state.client.subscribe(this.state.topicInput);
  }

  // This appends the subscriber text to the textarea component.
  appendSubText(data) {
    if (this.state.subTextBox === ""){
      this.setState({subTextBox: data})
    } else {
      let copy = this.state.subTextBox
      let newline = String.fromCharCode(13, 10)
      this.setState({subTextBox: copy.concat(newline, data)})
    }
  }

  // This appends the publisher text to the textarea component.
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

  // This is how we publish a message to the broker.
  addMsg(){
    // We ensure that we have a valid msg.
    if (this.state.msgInput.trim().length > 0){
      // Publish the msg to a publish(topic, msg)
      this.state.client.publish(this.state.ddTopic, this.state.msgInput)
      // Add the published message to the pub textarea.
      this.appendPubText()
      // Set the input state to null
      this.setState({msgInput: ""})
    }
  }

  // Event handler that determines if a user pressed the enter key
  // in the add msg/topic input boxes
  handleKeyPress(e) {
    if (e.charCode === 13 && e.target.id === "inputMsg"){
      this.addMsg()
    } else if (e.charCode === 13 && e.target.id === "inputTopic"){
      this.addTopic()
    }
  }

  // Event handler
  handleTopicHeader(e){
    this.setState({ddTopic: e.target.value})
  }

  // Event handler
  handleDeleteTopicHeader(e){
    this.setState({ddDeleteTopic: e.target.value})
  }

  // This is button click handler for the inactive topics.
  handleInactive(topics){
    let self = this
    var value = [], index;
    let act = self.state.activeTopic
    let inact = self.state.inactiveTopic.concat(topics)

    // We need to go through the list of active topics and splice
    // out the topics that are currently selected by the user.
    for (var i = 0, l = topics.length; i < l; i++) {
      index = act.indexOf(topics[i]);
      if (index > -1) {
        act.splice(index, 1);
      }
    }

    // Set the state to the new active and inactive topics.
    this.setState({activeTopic: act,
                  inactiveTopic: inact}, () => {
                  // Force a callback on the setState function
                  // to unsubscribe from the selected topics.
                  topics.map( function(topicName) {
                      self.state.client.unsubscribe(topicName)
                    });
                  })
  }

  // This is button click handler for the active topics.
  handleActive(topics){
    let self = this
    var value = [], index;
    let act = self.state.activeTopic.concat(topics)
    let inact = self.state.inactiveTopic

    // We need to go through the list of inactive topics and splice
    // out the topics that are currently selected by the user.
    for (var i = 0, l = topics.length; i < l; i++) {
      index = inact.indexOf(topics[i]);
      if (index > -1) {
        inact.splice(index, 1);
      }
    }

    // Set the state to the new active and inactive topics.
    this.setState({activeTopic: act,
                  inactiveTopic: inact}, () => {
                  // Force a callback on the setState function
                  // to subscribe from the selected topics.
                  topics.map( function(topicName) {
                      self.state.client.subscribe(topicName)
                    });
                  })
  }

  // This is button click handler to move all topics to inactive
  handleMoveAllInactive(){
    let self = this
    let inact = this.state.inactiveTopic.concat(this.state.activeTopic)
    this.setState({activeTopic: [],
                  inactiveTopic: inact}, () => {
                  // Force a callback on the setState function
                  // to unsubscribe from all the topics.
                  self.state.inactiveTopic.map( function(topicName) {
                      self.state.client.unsubscribe(topicName)
                    });
                  })


  }

  // This is button click handler to move all topics to active
  handleMoveAllActive(){
    let self = this
    let act = this.state.activeTopic.concat(this.state.inactiveTopic)
    this.setState({activeTopic: act,
                  inactiveTopic: []}, () => {
                    // Force a callback on the setState function
                    // to subscribe from all the topics.
                    self.state.activeTopic.map( function(topicName) {
                      self.state.client.subscribe(topicName)
                    });
                  })
  }

  // This is button click handler that allows the user to download the
  // subscriber log.
  downloadLog() {
    // This is a hacky javascript job.
    var element = document.createElement("a");
    // Creates a new blob object
    var file = new Blob([this.state.subTextBox], {type: 'text/plain'});
    // Sets ot to a url as a file
    element.href = URL.createObjectURL(file);
    element.download = "LogFile.txt";
    // Call a virtual 'click' to download the file.
    element.click();
  }

  render(){
    let message, ddItems, ddDeleteItems

    // This if statement determines if there are any topics in the JSON file.
    if (this.state.activeTopic.length !== 0 || this.state.inactiveTopic.length !== 0){
      let self = this

      // This variable holds a <StartMessage> component that we pass two parent functions to.
      message = <StartMessage client={this.state.client} appendSubText={this.appendSubText} />

      // this variable holds a dynamic list of dropdown buttons so the user can select what
      // topic to send a message to.
      ddItems = this.state.activeTopic.concat(this.state.inactiveTopic).map( function(topicName) {
                return <button className="dropdown-item" type="button" key={topicName} value={topicName} onClick={self.handleTopicHeader}>{topicName}</button>
              });

      // this variable holds a dynamic list of dropdown buttons so the user can select what
      // topic to delete.
      ddDeleteItems = this.state.activeTopic.concat(this.state.inactiveTopic).map( function(topicName) {
                return <button className="dropdown-item" type="button" key={topicName} value={topicName} onClick={self.handleDeleteTopicHeader}>{topicName}</button>
              });

    } else {
      // If there are no topics, we will set the dropdown items to temp values
      // and create a message to alert the user to add a topic.
      message = <div className="d-flex justify-content-center">
                  <span className="alert alert-primary">
                    No subscribers available, please add one below
                  </span>
                </div>

      ddItems = <button className="dropdown-item" type="button">Empty</button>
      ddDeleteItems = <button className="dropdown-item" type="button">Empty</button>

    }

    // Below is basic HTML
    return(
      <div className="App container">
        <div className="row">
          <div className="col-6">
            <h1>  Mqtt React Web Client </h1>
          </div>
          <div className="col-6 d-flex align-items-center">
            <button type="button" className="btn btn-outline-success ml-auto" onClick={this.downloadLog}>Download Sub Log</button>
          </div>
        </div>

        <br />

        <div className="row">
          <div className="col-6">
            <label>Publisher Log</label>
            <textarea className="form-control" id="subscriberText" rows="10"
              readOnly value={this.state.pubTextBox} />
          </div>

          <div className="col-6">
            <label>Subscriber Log</label>
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
            <input className="form-control" type="text" onChange={this.handleMsg} value={this.state.msgInput} onKeyPress={this.handleKeyPress} id="inputMsg"/>
            <div className="input-group-append">
              <button className="btn btn-primary" onClick={this.addMsg}> Send </button>
            </div>
          </div>
          <div className="input-group mb-3 col-6">
            <input className="form-control" type="text" onChange={this.handleTopic} value={this.state.topicInput} onKeyPress={this.handleKeyPress} id="inputTopic"/>
            <div className="input-group-append">
              <button className="btn btn-primary" onClick={this.addTopic}> Subscribe To Topic </button>
            </div>
          </div>
          <div className="input-group mb-3 col-12 d-flex ">
            <div className="input-group-prepend  ml-auto">
              <button className="btn btn-outline-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{this.state.ddDeleteTopic}</button>
              <div className="dropdown-menu">
                {ddDeleteItems}
              </div>
              <div className="input-group-append">
                <button className="btn btn-outline-danger" onClick={this.deleteTopic}> Delete </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
};
