import React, { Component } from 'react';

import BitcoinLogo from '../../assets/img/bitcoin-logo.svg';
import Chip from '../../assets/img/chip.svg';

import { Wrapper, Logo, DeviceFragment, DeviceTitle, Connected } from './styled';

class Header extends Component {
  render() {
    return (
      <Wrapper>
        <Logo
          src={BitcoinLogo}
        />
        <DeviceFragment>
          <DeviceTitle>
            <img
              src={Chip}
              alt="chip"
            />
            <span>Device</span>
          </DeviceTitle>
          <Connected
            onClick={this.props.isConnected ? this.props.disconnect : this.props.connect}
            isConnected={this.props.isConnected}
          >
            {this.props.isConnected ? 'Connected' : 'Not connected'}
          </Connected>
        </DeviceFragment>
      </Wrapper>
    );
  }
}

export default Header;
