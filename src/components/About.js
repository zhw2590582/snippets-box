import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import { version } from '../../package.json';

const AboutContainer = styled.div`
  margin-top: 20px;
  font-size: 14px;
  color: #666;
  .item {
    margin-bottom: 5px;
    .name {
      margin-right: 10px;
    }
    .info {
    }
  }
`;

const About = observer(props => {
  return (
    <AboutContainer>
      <div className="item clearfix">
        <p className="name fl">Name: </p>
        <p className="info fl">Snippets Box</p>
      </div>
      <div className="item clearfix">
        <p className="name fl">Version: </p>
        <p className="info fl">{version}</p>
      </div>
      <div className="item clearfix">
        <p className="name fl">Github: </p>
        <p className="info fl">
          <a href="https://github.com/zhw2590582/snippets-box" target="_blank">
            zhw2590582/snippets-box
          </a>
        </p>
      </div>
    </AboutContainer>
  );
});

export default About;
