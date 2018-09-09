import React, { Component } from 'react';
import { HomepageWrapper, Title, TransactionsFragment } from './styled';

class Homepage extends Component {
  render() {
    return (
      <HomepageWrapper>
        <Title>
          Recents transactions
        </Title>
        <TransactionsFragment>

        </TransactionsFragment>
      </HomepageWrapper>
    );
  }
}

export default Homepage;
