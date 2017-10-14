import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const SettingContainer = styled.div`

`;

class Setting extends React.Component {
  componentDidMount() {}

  render() {
    return <SettingContainer>Setting</SettingContainer>;
  }
}

Setting.propTypes = {
  store: PropTypes.object
};

export default Setting;