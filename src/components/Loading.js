import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Spin } from 'antd';

const LoadingContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  width: 100px;
  height: 100px;
  margin: -100px 0 0 -50px;
  text-align: center;
  padding-top: 25px;
  background: #ecf6fd;
  border: 1px solid #d2eafb;
  border-radius: 5px;
`;

const Loading = props => {
  return (
    <LoadingContainer>
      <Spin size="large" tip="Loading..." />
    </LoadingContainer>
  );
}

export default Loading;
