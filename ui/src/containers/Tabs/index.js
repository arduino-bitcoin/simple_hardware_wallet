import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom'
import './tabs.css';

const HOMEPAGE_ROUTE = '/';
const SEND_ROUTE = '/send';
const RECEIVE_ROUTE = '/receive';

class Tabs extends Component {
  isActive(target) {
    return target === this.props.location.pathname
  }

  render() {
    return (
      <div id="tabs-container">
        <div className="tabs-fragments">
          <div className={`tab ${this.isActive(HOMEPAGE_ROUTE) ? 'active-tab' : ''}`}><Link to={HOMEPAGE_ROUTE}>TX history</Link></div>
          <div className={`tab ${this.isActive(SEND_ROUTE) ? 'active-tab' : ''}`}><Link to={SEND_ROUTE}>Send</Link></div>
          <div className={`tab ${this.isActive(RECEIVE_ROUTE) ? 'active-tab' : ''}`}><Link to={RECEIVE_ROUTE}>Receive</Link></div>
        </div>
      </div>
    );
  }
}

export default withRouter(Tabs);
