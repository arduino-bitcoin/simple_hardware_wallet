import React, { Component } from 'react';
import Proptypes from 'prop-types';
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
            transactions={this.props.transactions}
          />
        </TransactionsFragment>
      </HomepageWrapper>
    );
  }
}

Homepage.proptypes = {
  transactions: Proptypes.array.isRequired,
}

export default Homepage;
