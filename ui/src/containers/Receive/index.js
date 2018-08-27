import React, { Component } from 'react';
import './receive.css';

class Receive extends Component {
  render() {
    return (
      <div>
        <p>This is the receive container!</p>
        
      {!!this.props.address && <p> Your Bitcoin address: {this.props.address}</p>}
      </div>
    );
  }
}

export default Receive;
