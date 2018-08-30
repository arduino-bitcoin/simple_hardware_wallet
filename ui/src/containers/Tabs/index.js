import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom'

import { TabsWrapper, Tab } from './styled';

import HistoryUnchecked from '../../assets/img/history_unchecked.svg';
import HistoryChecked from '../../assets/img/history_checked.svg';
import ReceiveUnchecked from '../../assets/img/receive_unchecked.svg';
import ReceiveChecked from '../../assets/img/receive_checked.svg';
import SendUnchecked from '../../assets/img/send_unchecked.svg';
import SendChecked from '../../assets/img/send_checked.svg';

const HOMEPAGE_ROUTE = '/';
const SEND_ROUTE = '/send';
const RECEIVE_ROUTE = '/receive';

class Tabs extends Component {
  isActive(target) {
    return target === this.props.location.pathname
  }

  render() {
    return (
        <TabsWrapper>
            <Tab
                active={this.isActive(HOMEPAGE_ROUTE)}
                imgSize="17px"
            >
                <Link to={HOMEPAGE_ROUTE}>
                    <img
                        src={this.isActive(HOMEPAGE_ROUTE) ? HistoryChecked : HistoryUnchecked}
                        alt="history"
                    />
                    <span>TX history</span>
                </Link>
            </Tab>
            <Tab
                active={this.isActive(SEND_ROUTE)}
                imgSize="24px"
            >
                <Link to={SEND_ROUTE}>
                    <img
                        src={this.isActive(SEND_ROUTE) ? SendChecked : SendUnchecked}
                        alt="send"
                    />
                    <span>Send</span>
                </Link>
            </Tab>
            <Tab
                active={this.isActive(RECEIVE_ROUTE)}
                imgSize="24px"
            >
                <Link to={RECEIVE_ROUTE}>
                    <img
                        src={this.isActive(RECEIVE_ROUTE) ? ReceiveChecked : ReceiveUnchecked}
                        alt="receive"
                    />
                    <span>Receive</span>
                </Link>
            </Tab>
        </TabsWrapper>
    );
  }
}

export default withRouter(Tabs);
