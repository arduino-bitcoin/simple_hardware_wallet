import React, { Component } from 'react';
import './receive.css';

class Receive extends Component {
  render() {
    console.log("receive props", this.props)
    return (
      <div>
        <p>This is the receive container!</p>
        
      {!!this.props.address && <p> Your Bitcoin address: {this.props.address}</p>}
      </div>
    );
  }
}

export default Receive;
