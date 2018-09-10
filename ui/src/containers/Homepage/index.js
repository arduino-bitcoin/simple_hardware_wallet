import React, { Component } from 'react';
import Proptypes from 'prop-types';
import { HomepageWrapper, Title, TransactionsFragment } from './styled';

//  Transactions Grid
import TransactionsGrid from '../../components/Grid/TransactionsGrid';

class Homepage extends Component {
  render() {
    const { address, transactions } = this.props;
    return (
      <HomepageWrapper>
        <Title>
          Recents transactions
        </Title>
        <TransactionsFragment>
          <TransactionsGrid
            address={address}
            transactions={transactions}
          />
        </TransactionsFragment>
      </HomepageWrapper>
    );
  }
}

Homepage.proptypes = {
  address: Proptypes.string,
  transactions: Proptypes.array.isRequired,
}

export default Homepage;
