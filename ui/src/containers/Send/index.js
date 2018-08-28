import React, { Component } from 'react';
import './send.css';

class SendForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.address = React.createRef();
    this.amount = React.createRef();
  }

  handleSubmit(event) {
    console.log('address=' + this.address.current.value);
    console.log('amount=' + this.amount.current.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Address
          <input type="text" ref={this.address} />
        </label>
        <label>
          Amount
          <input type="text" ref={this.amount} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

class Send extends Component {
  render() {
    return (
      <div>
        <p>This is the send container!</p>
        <SendForm />
      </div>
    );
  }
}

export default Send;
