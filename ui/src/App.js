import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { Layout } from './components/common/Layout';
import './App.css';

import Header from './containers/Header';
import Tabs from './containers/Tabs';
import Homepage from './containers/Homepage';
import Send from './containers/Send';
import Receive from './containers/Receive';

import bitcoin from 'bitcoinjs-lib'

function clean(str){
  return str.replace(/[^0-9a-z]/gi, '');
}

class InsightAPI {
  constructor(options){
    let defaults = {
      url: "https://test-insight.bitpay.com/api/",
      network: bitcoin.networks.testnet,
    };
    Object.assign(this, defaults, options);
  }
  async balance(address){
    let result = await fetch(this.url + "addr/" + address);
    let json = await result.json();
    return json.balanceSat + json.unconfirmedBalanceSat;
  }
  async utxo(address){
    let result = await fetch(this.url + "addr/" + address + "/utxo");
    let json = await result.json();
    return json;
  }
  async buildTx(my_address, address, amount, fee=1500){
    // cleaning up random characters
    address = clean(address);
    my_address = clean(my_address);

    let builder = new bitcoin.TransactionBuilder(this.network);

    let utxo = await this.utxo(my_address);
    let total = 0;
    for(let i=0; i < utxo.length; i++){
      let tx = utxo[i];
      total += tx.satoshis;
      builder.addInput(tx.txid, tx.vout);
      if(total > amount+fee){
        break;
      }
    }
    if(total < amount+fee){
      throw "Not enough funds";
    }
    console.log(address, amount, address.length);
    console.log(my_address, total - amount - fee, my_address.length);

    builder.addOutput(address, amount);
    builder.addOutput(my_address, total - amount - fee); // change
    return builder.buildIncomplete().toHex()
  }
  async broadcast(tx){
    tx = clean(tx);
    console.log("broadcasting tx:", tx);
    let result = await fetch(this.url + "tx/send", {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin", // include, same-origin, *omit
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        redirect: "follow",
        referrer: "no-referrer",
        body: JSON.stringify({rawtx:tx}),
    })
    let text = await result.text();
    console.log(text);
  }
}

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      port: undefined,
      address: undefined,
      buffer: "", // receive buffer from serialport
      blockchain: new InsightAPI(),
    }
  }

  componentDidMount() {
    // Attempt to reconnect
    this.reconnect()

    // Set handler for USB disconnections
    navigator.usb.ondisconnect = this.handleDisconnect.bind(this)

    // Set handler for USB connections
    navigator.usb.onconnect = this.reconnect.bind(this)
  }

  connect() {
    window.serial.requestPort().then(this.handlePort.bind(this))
  }

  reconnect() {
    window.serial.getPorts().then(ports => {
      if (ports.length == 0) {
        console.log("no ports found")
      } else {
        console.log("found ports:", ports)
        // For now, just connect to the first one
        this.handlePort(ports[0])
      }
    })
  }

  disconnect() {
    this.state.port.disconnect();
    this.setState({ port: undefined });
  }

  handleDisconnect(evt) {
    if (this.state.port.device_ == evt.device) {
      // The device has disconnect
      // We need to update the state to reflect this
      this.setState({ port: undefined });
    }
  }

  handlePort(port) {
    console.log('Connecting to ' + port.device_.productName + '...');
    port.connect().then(() => {
      console.log('Connected to port:', port);
      port.onReceive = this.handleSerialMessage.bind(this)
      port.onReceiveError = this.handleSerialError.bind(this)

      // Save the port object on state
      this.setState({ port })

      // Try to load our bitcoin address
      let textEncoder = new TextEncoder();
      let payload = textEncoder.encode("addr")
      port.send(payload)
          .catch(error => console.log("Error requesting Bitcoin address", error))

    }, error => {
      console.log('Connection error: ' + error);
    });
  }

  handleSerialMessage(raw) {
    let buffer = this.state.buffer;
    let textDecoder = new TextDecoder();
    let message = textDecoder.decode(raw);
    // append new data to buffer
    buffer += message;
    // check if new line character is there
    let index = buffer.indexOf("\n");
    if(index < 0){
      this.setState({ buffer });
      return;
    }
    let commands = buffer.split("\n");
    buffer = commands.pop(); // last unfinished command
    this.setState({ buffer });

    // going through all the commands
    commands.forEach(message => {
      let [command, payload] = message.split(",");
      if (command === "addr") {
        console.log("received addr message");
        let address = payload.replace(/[^0-9a-z]/gi, '');
        this.setState({ address });
      }
      else if (command === "sign_tx") {
        console.log("received tx signature");
        this.setState({ sign_tx: payload });
        this.state.blockchain.broadcast(payload);
      }
      else if (command === "sign_tx_error") {
        console.log("sign_tx error", payload);
      }
      else {
        console.log("unhandled message", message);
      }
    });
  }

  handleSerialError(error) {
    console.log('Serial receive error: ' + error);
  }

  async signTx(address, amount) {
    let unsigned = await this.state.blockchain.buildTx(this.state.address, address, amount)
    let textEncoder = new TextEncoder();
    let message = "sign_tx " + unsigned
    this.state.port.send(textEncoder.encode(message))
      .catch(error => {
        console.log('Send error: ' + error);
      });
  }

  renderPage() {
    let address = this.state.address
    let connected = !!this.state.port
    return (
      <Switch>
        <Route exact path="/" component={Homepage} />
        <Route path="/send" render={props => <Send {...props} signTx={this.signTx.bind(this)}
                    connected={connected} />} />
        <Route path="/receive" render={props => <Receive {...props} address={address} />} />
      </Switch>
    );
  }

  render() {
    return (
      <BrowserRouter>
        <div className="App">
            <Header
                connect={port => this.connect(port)}
                disconnect={() => this.disconnect()}
                isConnected={!!this.state.port}
            />
            <Layout>
                <Tabs location={this.props.location} />
                {this.renderPage()}
            </Layout>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
