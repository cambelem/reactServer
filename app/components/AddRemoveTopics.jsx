import React, { Component } from 'react';


export default class AddRemoveTopics extends Component {

  constructor(){
    super()
    this.state = {active: [],
                  inactive: []}

    this.inactiveBtn = this.inactiveBtn.bind(this)
    this.activeBtn = this.activeBtn.bind(this)
    this.moveAllInactive = this.moveAllInactive.bind(this)
    this.moveAllActive = this.moveAllActive.bind(this)

    this.handleActiveOpts = this.handleActiveOpts.bind(this)
    this.handleInactiveOpts = this.handleInactiveOpts.bind(this)
  }

  inactiveBtn(){
    if (this.state.active.length !== 0){
      this.props.handleInactive(this.state.active)
      this.setState({active: []})
    }
  }

  activeBtn(){
    if (this.state.inactive.length !== 0){
      this.props.handleActive(this.state.inactive)
      this.setState({inactive: []})

    }
  }

  moveAllInactive(){
    this.props.handleMoveAllInactive()
  }

  moveAllActive(){
    this.props.handleMoveAllActive()
  }

  handleActiveOpts(e){
    var options = e.target.options;
    var value = [];
    for (var i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }

    this.setState({active: value})
  }

  handleInactiveOpts(e){
    var options = e.target.options;
    var value = [];
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
      activeOpts = this.props.activeTopics.map( function(topicName) {
                return <option key={topicName} value={topicName}>{topicName}</option>
              });
    } else {
      activeOpts = null
    }

    if (this.props.inactiveTopics.length !== 0 ) {
      inactiveOpts = this.props.inactiveTopics.map( function(topicName) {
                return <option key={topicName} value={topicName}>{topicName}</option>
              });
    } else {
      inactiveOpts = null
    }

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
