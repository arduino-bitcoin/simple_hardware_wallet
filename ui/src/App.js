import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';

import Header from './containers/Header';
import Tabs from './containers/Tabs';
import Homepage from './containers/Homepage';
import Send from './containers/Send';
import Receive from './containers/Receive';

class App extends Component {

  renderPage() {
    return (
      <Switch>
        <Route exact path="/" component={Homepage} />
        <Route path="/send" component={Send} />
        <Route path="/receive" component={Receive} />
      </Switch>
    );
  }

  render() {
    return (
      <BrowserRouter>
        <div className="App">
            <Header />
            <Tabs location={this.props.location} />
            {this.renderPage()}
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
