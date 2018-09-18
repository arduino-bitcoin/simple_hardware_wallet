import React, { Component } from 'react';
import Embed from '../../components/common/Embed';
import './receive.css';

class Receive extends Component {
    //  TODO: add a input for the amount, so we can add it to the qr code.
    //  ex: https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl=bitcoin:${ADDRESS}?&amount=${AMOUNT_IN_BTC}
    getQrCodeSrc(address) {
        if(!address) {
            return null;
        }
        return `https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl=bitcoin:${address}`;

    }

    render() {
        const { address } = this.props;
        const qrCodeSrc = this.getQrCodeSrc(address);
        return (
            <div>
                <p>This is the receive container!</p>
                {!!address && <p> Your Bitcoin address: {address}</p>}

                <Embed  src={qrCodeSrc} />
            </div>
        );
    }
}

export default Receive;
