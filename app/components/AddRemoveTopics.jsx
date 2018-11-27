import React, { Component } from 'react';


export default class AddRemoveTopics extends Component {

  render(){
    let opts, select

    if (this.props.activeTopics.length !== 0 ) {
      opts = this.props.activeTopics.map( function(topicName) {
                return <option value={topicName}>{topicName}</option>
              });
    } else {
      opts = null
    }

    if (opts == null) {
      select = null
    } else {
      select = <div className="d-flex justify-content-around">

                  <div className="col-4">
                    <label>Active Topics</label>
                    <select className="custom-select" multiple>
                      {opts}
                    </select>
                  </div>
                  <div className="col-1 text-center">
                    <button className="btn btn-outline-secondary btn-sm"> &nbsp;&gt;&nbsp; </button>
                    <button className="btn btn-outline-secondary btn-sm"> &nbsp;&lt;&nbsp; </button>

                    <button className="btn btn-outline-secondary btn-sm"> &gt;&gt; </button>
                    <button className="btn btn-outline-secondary btn-sm"> &lt;&lt; </button>
                  </div>
                  <div className="col-4">
                    <label>Active Topics</label>
                    <select className="custom-select" multiple>
                      {opts}
                    </select>
                  </div>
              </div>
    }

    return (
      <div>
        {select}
      </div>
    )
  }
}
