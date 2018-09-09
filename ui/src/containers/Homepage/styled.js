import styled from 'styled-components';

export const HomepageWrapper = styled.div`
  float: left;
  width: 100%;
  height: 100%;
`;

export const Title = styled.span`
  margin: 27px 35px;
  font-size: 20px;
  font-weight: bold;
  letter-spacing: 0.1px;
  color: #1a173b;
  text-align: left;
  float: left;
`;

export const TransactionsFragment = styled.div`
  float: left;
  margin: 27px 35px;
  width: calc(100% - 70px);
  background: white;
  border-radius: 3.5px;
  border: solid 1px #ebedf8;

  >div {
    padding: 50px;
  }
`;
