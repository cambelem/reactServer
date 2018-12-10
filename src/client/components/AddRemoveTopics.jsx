import React, { Component } from 'react';


export default class AddRemoveTopics extends Component {

  constructor(){
    super()

    // These are fields used within the React App.
    // Whenever one or more of these variables are changed
    // via a setState, the app well rerender information
    this.state = {active: [],
                  inactive: []}

    // This block of function binds are needed for React
    // to find the functions and pass to children components.
    this.inactiveBtn = this.inactiveBtn.bind(this)
    this.activeBtn = this.activeBtn.bind(this)
    this.moveAllInactive = this.moveAllInactive.bind(this)
    this.moveAllActive = this.moveAllActive.bind(this)

    this.handleActiveOpts = this.handleActiveOpts.bind(this)
    this.handleInactiveOpts = this.handleInactiveOpts.bind(this)
  }

  // Event handlers for the inactive btn.
  inactiveBtn(){
    if (this.state.active.length !== 0){
      // Calls the View's handleInactive function with
      // this component's active state.
      this.props.handleInactive(this.state.active)
      this.setState({active: []})
    }
  }

  // Event handlers for the inactive btn.
  activeBtn(){
    if (this.state.inactive.length !== 0){
      // Calls the View's handleInactive function with
      // this component's inactive state.
      this.props.handleActive(this.state.inactive)
      this.setState({inactive: []})

    }
  }

  // Event handlers for the move all inactive btn.
  moveAllInactive(){
    this.props.handleMoveAllInactive()
  }

  // Event handlers for the move all active btn.
  moveAllActive(){
    this.props.handleMoveAllActive()
  }

  // Event handlers for the active textarea
  handleActiveOpts(e){
    var options = e.target.options;
    var value = [];
    // The user might pick and choose multiple Topics
    // push those values to the state.
    for (var i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }

    this.setState({active: value})
  }

  // Event handlers for the inactive textarea
  handleInactiveOpts(e){
    var options = e.target.options;
    var value = [];
    // The user might pick and choose multiple Topics
    // push those values to the state.
    for (var i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }

    this.setState({inactive: value})
  }

  render(){
    let activeOpts, inactiveOpts, select

    if (this.props.activeTopics.length !== 0 ) {
      // Creates a dynamic list of active topics in the textarea for the user to click on.
      activeOpts = this.props.activeTopics.map( function(topicName) {
                return <option key={topicName} value={topicName}>{topicName}</option>
              });
    } else {
      activeOpts = null
    }

    if (this.props.inactiveTopics.length !== 0 ) {
      // Creates a dynamic list of inactive topics in the textarea for the user to click on.
      inactiveOpts = this.props.inactiveTopics.map( function(topicName) {
                return <option key={topicName} value={topicName}>{topicName}</option>
              });
    } else {
      inactiveOpts = null
    }

    // basic HTML
    return (
      <div>
        <div className="d-flex justify-content-around">
          <div className="col-4">
            <label>Active Topics</label>
            <select className="custom-select" multiple onChange={this.handleActiveOpts}>
              {activeOpts}
            </select>
          </div>
          <div className="col-1 text-center" style={{paddingTop: "10px"}}>
            <button className="btn btn-outline-secondary btn-sm" onClick={this.inactiveBtn}> &nbsp;&gt;&nbsp; </button>
            <button className="btn btn-outline-secondary btn-sm" onClick={this.activeBtn}> &nbsp;&lt;&nbsp; </button>

            <button className="btn btn-outline-secondary btn-sm" onClick={this.moveAllInactive}> &gt;&gt; </button>
            <button className="btn btn-outline-secondary btn-sm" onClick={this.moveAllActive}> &lt;&lt; </button>
          </div>
          <div className="col-4">
            <label>Inactive Topics</label>
            <select className="custom-select" multiple onChange={this.handleInactiveOpts}>
              {inactiveOpts}
            </select>
          </div>
        </div>
      </div>
    )
  }
}
