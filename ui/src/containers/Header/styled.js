import styled from 'styled-components';

export const Wrapper = styled.header`
  height: 64px;
  width: 100%;
  display: inline-block;
  background: white;
  border-bottom: solid 1px #e8e8e8;
  margin-bottom: -4px;
`;

export const Logo = styled.img`
  float: left;
  height: 30px;
  width: 20px;
  margin: 17px 30px;
`;

export const DeviceFragment = styled.div`
  min-width: 200px;
  height: 100%;
  float: right;
  padding-right: 30px;
`;

export const DeviceTitle = styled.div`
  margin-top: 14px;
  text-align: right;

  >span {
    width: 100%;
    opacity: 0.5;
    font-family: Lato;
    font-size: 10px;
    font-weight: bold;
    letter-spacing: 0.1px;
    color: #323c47;
  }

  >img {
    margin-right: 6px;
  }
`;

export const Connected = styled.div`
  text-align: right;
  color: ${(props) => props.isConnected ? '#0077ff' : 'red'}
`;
