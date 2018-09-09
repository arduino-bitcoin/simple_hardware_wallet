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
    event.preventDefault();
    const address = this.address.current.value;
    const amount = this.amount.current.value;
    this.props.signTx(address, Number(amount));
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
          <input type="number" ref={this.amount} />
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
      {this.props.connected && <SendForm signTx={this.props.signTx} />}
      </div>
    );
  }
}

export default Send;
