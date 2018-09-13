import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import io from 'socket.io-client'
import InsightAPI from './services/InsightAPI';

import { Layout } from './components/common/Layout';
import './App.css';

import Header from './containers/Header';
import Tabs from './containers/Tabs';
import Homepage from './containers/Homepage';
import Send from './containers/Send';
import Receive from './containers/Receive';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      port: undefined,
      address: undefined,
      buffer: "", // receive buffer from serialport
      blockchain: new InsightAPI(),
      transactions: [],
    }

    this.connect = this.connect.bind(this);
    this.reconnect = this.reconnect.bind(this);
    this.handleDisconnect = this.handleDisconnect.bind(this);

    // Set handler for USB disconnections
    navigator.usb.ondisconnect = this.handleDisconnect;

    // Set handler for USB connections
    navigator.usb.onconnect = this.reconnect;
  }

  componentDidMount() {
    this.reconnect();
  }

  connect() {
    window.serial.requestPort().then((port) => this.handlePort(port));
  }

  reconnect() {
    window.serial.getPorts().then(ports => {
      if (ports.length === 0) {
        console.log("no ports found");
      } else {
        console.log("found ports:", ports);
        // For now, just connect to the first one
        this.handlePort(ports[0]);
      }
    })
  }

  disconnect() {
    this.state.port.disconnect();
    this.setState({ port: undefined });
  }

  handleDisconnect(evt) {
    if (this.state.port.device_ === evt.device) {
      // The device has disconnect
      // We need to update the state to reflect this
      this.setState({ port: undefined });
    }
  }

  handlePort(port) {
    console.log('Connecting to ' + port.device_.productName + '...');
    port.connect().then(() => {
      console.log('Connected to port:', port);
      port.onReceive = this.handleSerialMessage.bind(this);
      port.onReceiveError = this.handleSerialError.bind(this);

      // Save the port object on state
      this.setState({ port })

      // Try to load our bitcoin address
      const textEncoder = new TextEncoder();
      const payload = textEncoder.encode("addr");
      port.send(payload)
          .catch(error => console.log("Error requesting Bitcoin address", error))

    }, error => {
      console.log('Connection error: ' + error);
    });
  }

  handleSerialMessage(raw) {
    let buffer = this.state.buffer;
    const textDecoder = new TextDecoder();
    const message = textDecoder.decode(raw);
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
        const address = payload.replace(/[^0-9a-z]/gi, '');

        this.setState({ address });
        this.handleChangeAddress(address);
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

  //  @dev handles setting new address
  //  We will fetch all the address' transactions and connect to the web socket
  handleChangeAddress(newAddress, oldAddress = null) {

    //  @dev - If the new address is null, return null
    if(!newAddress) {
      return null;
    }

    //  @dev - If the address is the same, we skip reconnecting to the socket
    if (newAddress !== oldAddress) {

      const socket = io("https://test-insight.bitpay.com/");
      //  Start the connection to the bitpay websocket
      //  TODO as for now we are using the test network, in the future,
      //  set the network dynamically
      socket.on('connect', function() {
        // Join the room.
        socket.emit('subscribe', 'inv');
      });

      socket.on('bitcoind/addresstxid', ({ address, txid }) => { return this.addTransaction(txid) });
      socket.on('connect', () => socket.emit('subscribe', 'bitcoind/addresstxid', [ newAddress ]))
    }

    //  Delete previous transactions
    this.setState({ transactions: [] });

    //  Fetch all the address' transactions
    this.getTransactions(newAddress)
      .then((transactions) => {
        transactions.map((transactionId) => {
          this.addTransaction(transactionId);
        })
      });

  }

  async signTx(address, amount) {
    const unsigned = await this.state.blockchain.buildTx(this.state.address, address, amount);
    const textEncoder = new TextEncoder();
    const message = "sign_tx " + unsigned;
    this.state.port.send(textEncoder.encode(message))
      .catch(error => {
        console.log('Send error: ' + error);
      });
  }

  async getTransactions(address) {
    return await this.state.blockchain.transactions(address);
  }

  async getTransactionDetails(transactionId) {
    return await this.state.blockchain.transactionDetails(transactionId);
  }

  //  @dev - Adds or Updates an transaction in the transactions list
  //  @params {string} - transaction ID
  async addTransaction(transactionId) {
    const transactions = this.state.transactions;
    return this.getTransactionDetails(transactionId)
      .then((transDetails) => {

        //  try to find if there is a transaction with Id equal to the {transactionId}
        //  If there is, update that transaction with new infromation
        //  If not add that transaction to the transactions array
        let isNewTransaction = true;
        transactions.map((trans, index) => {
          if (trans.txid === transactionId) {

            console.log("Updating transaction:", transactionId);
            transactions[index] = transDetails;
            isNewTransaction = false;
          }
        });

        //  Is a new transaction?
        //  If so add it to the array
        if (isNewTransaction) {
          console.log("Inserting transaction:", transactionId);
          return this.setState({ transactions: [...this.state.transactions, transDetails] })
        }
      });
  }

  renderPage() {
    const address = this.state.address;
    const connected = !!this.state.port;
    return (
      <Switch>
        <Route exact path="/" render={props => <Homepage {...props} address={address} transactions={this.state.transactions || []} />} />
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
