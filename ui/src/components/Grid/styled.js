import styled from 'styled-components';

export const TransactionsWrapper = styled.div`
  display: grid;
  grid-template-columns: 4fr repeat(4, 1fr);
  grid-template-rows: 21px repeat(auto-fill, 28px);
  text-align: left;
  grid-row-gap: 18px;
  grid-column-gap: 10px;
`;

export const Header = styled.div`
  height: 11px;
  font-size: 9.5px;
  letter-spacing: 1.4px;
  color: #b4bac6;
  padding-bottom: 10px;
  text-transform: uppercase;
  text-align: ${(props) => props.textCenter ? 'center' : 'left'};
`;

export const Cell = styled.div`
  font-size: 14px;
  letter-spacing: 0.1px;
  color: #8a96a0;
  line-height: 28px;
`;

export const BigCell = styled(Cell)`
  font-weight: bold;
  letter-spacing: normal;
  color: #354052;

  >img {
    float: left;
    height: 20px;
    width: 20px;
    margin: 4px 20px 4px 0;
  }

  >span {
    float: left;
    width: calc(100% - 40px);
    height: 100%;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
`;

export const Status = styled.div`
  padding: 0 17px;
  height: 28px;
  font-family: Lato;
  border-radius: 3.6px;
  font-size: 13px;
  font-weight: bold;
  color: white;
  text-align: center;
  background-color: ${(props) => props.color || '#cf5757'};
  float: right;
`;
