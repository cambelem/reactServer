import React, { Component } from 'react';


export default class AddRemoveTopics extends Component {

  render(){
    let opts

    if (this.props.activeTopics.length !== 0 ) {
      opts = this.props.activeTopics.map( function(topicName) {
                return <option value={topicName}>{topicName}</option>
              });
    } else {
      opts = null
    }
    return (
      <div>
        <label>Active Topics</label>
        <br></br>
        <select multiple>
          {opts}
        </select>
      </div>
    )
  }
}
