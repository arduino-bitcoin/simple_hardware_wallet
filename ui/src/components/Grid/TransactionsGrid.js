import React, { Component } from 'react';
import Proptypes from 'prop-types';
import { TransactionsWrapper, Header, Cell, BigCell, Status } from './styled';

import SendTransactionIcon from '../../assets/img/send_transaction.svg';
import ReceiveTransactionIcon from '../../assets/img/receive_transaction.svg';

class TransactionsGrid extends Component {

  calculateValue(myAddress, transaction, isSendTransaction) {
    let totalValue = 0;

    transaction.vout.map(({ value, scriptPubKey }) => {
      scriptPubKey.addresses.map((address) => {
        if (isSendTransaction) {
          if (address !== myAddress) {
            totalValue += parseFloat(value);
          }
        } else {
          if (address === myAddress) {
            totalValue += parseFloat(value);
          }
        }
      })
    })

   return totalValue;
  }

  //  @dev - Display the transactions
  renderTransactions() {
    const { address, transactions } = this.props;

    return transactions.map((transaction, index) => {

      //  TODO find another way to check if it a received or send transaction
      const isSendTransaction = address === transaction.vin[0].addr;
      const imgSrc = isSendTransaction ? SendTransactionIcon : ReceiveTransactionIcon;

      const transactionTime = new Date(transaction.time * 1000);
      const timeOptions = { hour: '2-digit', minute:'2-digit' };
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
          {transactionTime.toLocaleTimeString(navigator.language, timeOptions)}
        </Cell>,
        <Cell
          key={`date-${index}`}
        >
          {transactionTime.toLocaleDateString()}
        </Cell>,
        <Cell
          key={`value-${index}`}
        >
          {this.calculateValue(address, transaction, isSendTransaction)}
        </Cell>,
        <Cell
          key={`statur-${index}`}
        >
          {this.renderTransactionStatus(transaction.confirmations)}
        </Cell>,
      ];
    })
  }

  renderTransactionStatus(confirmations = 0, isSendTransaction) {
    if (confirmations < 6) {
      return <Status color="#f79015">Pending</Status>;
    }

    if (confirmations === 6) {
      return <Status color="#0077ff">6 confirmations</Status>;
    }

    const msg = isSendTransaction ? 'Sent' : 'Received';

    return <Status color="#0077ff">{msg}</Status>;
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
        {this.renderTransactions()}
      </TransactionsWrapper>
    );
  }
}

TransactionsGrid.Proptypes = {
  address: Proptypes.string,
  transactions: Proptypes.array.isRequired,
}

export default TransactionsGrid;
