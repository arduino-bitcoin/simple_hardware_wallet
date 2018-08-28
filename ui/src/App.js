import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';

import Header from './containers/Header';
import Tabs from './containers/Tabs';
import Homepage from './containers/Homepage';
import Send from './containers/Send';
import Receive from './containers/Receive';

import bitcoin from 'bitcoinjs-lib'

function buildTx(address, amount) {
  let builder = new bitcoin.TransactionBuilder()
  // FIXME hard-coded TxIn or now ...
  builder.addInput("fd38592197a014b527b81da5c232d08c5af651e67c3ce30adb52e99125ed6e42", 0)
  builder.addOutput(address, amount) 
  return builder.buildIncomplete().toHex()
}

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      port: undefined,
      address: undefined,
    }
  }

  connect(port) {
    window.serial.requestPort().then(selectedPort => {
      var port = selectedPort;
      console.log('Connecting to ' + port.device_.productName + '...');
      port.connect().then(() => {
        console.log('Connected to port:', port);
        port.onReceive = this.handleSerialMessage.bind(this)
        port.onReceiveError = this.handleSerialError.bind(this)

        // Try to load our bitcoin address
        let textEncoder = new TextEncoder();
        let payload = textEncoder.encode("addr")
        port.send(payload)
            .catch(error => console.log("Error requesting Bitcoin address", error))

      }, error => {
        console.log('Connection error: ' + error);
      });

      // Save the port object on state
      this.setState({ port })

    }).catch(error => {
      console.log('Connection error: ' + error);
    });
  }

  disconnect(port) {
    // TODO: should tell the device to disconnect?
    this.setState({ port: undefined });
  }

  handleSerialMessage(raw) {
    let textDecoder = new TextDecoder();
    let message = textDecoder.decode(raw);
    let [command, payload] = message.split(",");
    if (command === "addr") {
      console.log("received addr message");
      this.setState({ address: payload })
    }
  }

  handleSerialError(error) {
    console.log('Serial receive error: ' + error);
  }

  signTx(address, amount) {
    let unsigned = buildTx(address, amount)
    let textEncoder = new TextEncoder();
    this.state.port.send(textEncoder.encode(unsigned)).catch(error => {
      console.log('Send error: ' + error);
    });
  }

  renderPage() {
    let address = this.state.address
    return (
      <Switch>
        <Route exact path="/" component={Homepage} />
        <Route path="/send" component={Send} />
        <Route path="/receive" render={props => <Receive {...props} address={address} />}
        />
      </Switch>
    );
  }

  render() {
    return (
      <BrowserRouter>
        <div className="App">
            <Header
                connect={port => this.connect(port)}
                disconnect={port => this.disconnect(port)}
                isConnected={!!this.state.port}/>
            <Tabs location={this.props.location} />
            {this.renderPage()}
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
