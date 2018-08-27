import styled from 'styled-components';

export const TabsWrapper = styled.div`
  width: 100%;
  float: left;
  height: 100%;
  border-right: solid 1px #e8e8e8;
  background: white;
  display: inline-block;
  padding: 10px 0px;
`;


export const Tab = styled.div`
  margin: 20px 0;
  float: left;
  line-height: 65px;
  padding: 0 30px;
  float: left;
  height: 50px;
  line-height: 50px;
  color: #637280;
  font-size: 13.7px;
  letter-spacing: 0.1px;
  color: #637280;
  position: relative;


  ${(props) => {
    if(props.active) {
      return 'border-left: solid 2px #0290ff;padding-left: 28px;font-weight: bold;color: #1880e7;'
    }

  }}

  > a {
    text-decoration: none;
    color: inherit;

  }

  span {
    padding-left: 36px;
  }

  img  {
    position: absolute;
    left: 30px;
    top: calc(50% - 9px);
    height: 18px;
    width: 18px;

  }


`;
