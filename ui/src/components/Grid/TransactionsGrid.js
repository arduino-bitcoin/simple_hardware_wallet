import React, { Component } from 'react';
import Proptypes from 'prop-types';
import { TransactionsWrapper, Header, Cell, BigCell } from './styled';

import SendTransactionIcon from '../../assets/img/send_transaction.svg';
import ReceiveTransactionIcon from '../../assets/img/receive_transaction.svg';

const testTrans = {
  txid: "e98dc0eb1a2809b0f0bbec12ebee4065b5ad7a4df9b8823b93a32e8362f41725",
  version: 1,
  locktime: 0,
  vin: [
    {
      txid: "afeadb5288a520e8980734465cb11cc2f93fbe9b01f8f9913f1fde8aaaf9f59f",
      vout: 0,
      sequence: 4294967295,
      n: 0,
      scriptSig: {
        hex: "483045022100a342e0598b146058ac77decb86073749bad6ef27271ab6636e7287918016a333022019bbdf19f8969e0b5016002d9650ecd6098a8fab6cb6ae2fc262353a91a16f81012103f14e3a81cfc4b56770ced622a357c188c6e37cd3b65fcd2753db2644294f6da5",
        asm: "3045022100a342e0598b146058ac77decb86073749bad6ef27271ab6636e7287918016a333022019bbdf19f8969e0b5016002d9650ecd6098a8fab6cb6ae2fc262353a91a16f81[ALL] 03f14e3a81cfc4b56770ced622a357c188c6e37cd3b65fcd2753db2644294f6da5"
      },
      addr: "n22FHtLZTL2pog5e811EaLj9S8Cv6CZxS1",
      valueSat: 1172510400,
      value: 11.725104,
      doubleSpentTxID: null
    }
  ],
    vout: [
      {
        value: "0.00000000",
        n: 0,
        scriptPubKey:
          {
            hex: "6a4c500002803e0001d95e5b0982f5c12b0a22434dee9466264742c531e3d348d567d26a519970f90081b105e4c04e7d63da041ea08cb65b951d7c060bcdb54c17e636e469e1cabb007fc4e2d0d84a8d11fd19",
            asm: "OP_RETURN 0002803e0001d95e5b0982f5c12b0a22434dee9466264742c531e3d348d567d26a519970f90081b105e4c04e7d63da041ea08cb65b951d7c060bcdb54c17e636e469e1cabb007fc4e2d0d84a8d11fd19"
          },
        spentTxId: null,
        spentIndex: null,
        spentHeight: null
      },
    {
    value: "11.71448400",
    n: 1,
    scriptPubKey: {
      hex: "76a914f5000e0823a0a66944cd14ba55bc9b6a95ecd68988ac",
      asm: "OP_DUP OP_HASH160 f5000e0823a0a66944cd14ba55bc9b6a95ecd689 OP_EQUALVERIFY OP_CHECKSIG",
      addresses:
        [
          "n3rPurtBD9ddA4z9bKvMKiivQRCpsUsvCQ"
        ],
      type: "pubkeyhash"
      },
    spentTxId: null,
    spentIndex: null,
    spentHeight: null
    }
  ],
  blockheight: -1,
  confirmations: 0,
  time: 1536499075,
  valueOut: 11.714484,
  size: 284,
  valueIn: 11.725104,
  fees: 0.01062
};

class TransactionsGrid extends Component {

  //  @dev - Display the transactions
  renderTransactions(transactions) {
    return [testTrans, testTrans].map((transaction, index) => {
      console.log(transaction, index);
      const isSendTransaction = true;
      const imgSrc = index % 2 === 0 ? SendTransactionIcon : ReceiveTransactionIcon;

      const transactionTime = new Date(transaction.time * 1000);
      var options = { hour: '2-digit', minute: '2-digit' };

      return [
        <BigCell
          key={`id-${index}`}
          title={transaction.txid}
        >
          <img
            src={imgSrc}
            alt="transaction"
          />
          <span>
            {transaction.txid}
          </span>
        </BigCell>,
        <Cell
          key={`time-${index}`}
        >
          {transactionTime.toLocaleString(options)}
        </Cell>,
        <Cell
          key={`date-${index}`}
        >
          {transactionTime.toLocaleDateString()}
        </Cell>,
        <Cell
          key={`value-${index}`}
        >
          {transaction.valueOut}
        </Cell>,
        <Cell
          key={`statur-${index}`}
        >
          56
        </Cell>,
      ];
    })
  }

  render() {
    const { transactions } = this.props;
    return (
      <TransactionsWrapper>
        <Header>description</Header>
        <Header>time</Header>
        <Header>date</Header>
        <Header>value</Header>
        <Header textCenter >status</Header>
        {this.renderTransactions(transactions)}
      </TransactionsWrapper>
    );
  }
}

TransactionsGrid.Proptypes = {
  transactions: Proptypes.array.isRequired,
}

export default TransactionsGrid;
