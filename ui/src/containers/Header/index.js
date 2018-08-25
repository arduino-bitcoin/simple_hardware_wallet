import React, { Component } from 'react';

import BitcoinLogo from '../../assets/img/bitcoin-logo.svg';
import Chip from '../../assets/img/chip.svg';

import { Wrapper, Logo, DeviceFragment, DeviceTitle, Connected } from './styled';

class Header extends Component {

  // @dev - checks if the device is connected to the usb port
  isDeviceConnected() {
    // TODO: add function that checks if the device is connected
    return true;
  }

  render() {
    const isConnected = this.isDeviceConnected();
    return (
      <Wrapper>
        <Logo
          src={BitcoinLogo}
        />
        <DeviceFragment>
          <DeviceTitle>
            <img src={Chip} />
            <span>Device</span>
          </DeviceTitle>
          <Connected
            isConnected={isConnected}
          >
            {isConnected ? 'Connected' : 'Not connected'}
          </Connected>
        </DeviceFragment>
      </Wrapper>
    );
  }
}

export default Header;
