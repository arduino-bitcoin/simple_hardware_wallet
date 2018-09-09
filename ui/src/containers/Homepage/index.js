import React, { Component } from 'react';
import { HomepageWrapper, Title, TransactionsFragment } from './styled';

//  Transactions Grid
import TransactionsGrid from '../../components/Grid/TransactionsGrid';

class Homepage extends Component {
  render() {
    return (
      <HomepageWrapper>
        <Title>
          Recents transactions
        </Title>
        <TransactionsFragment>
          <TransactionsGrid
            transactions={[]}
          />
        </TransactionsFragment>
      </HomepageWrapper>
    );
  }
}

export default Homepage;
