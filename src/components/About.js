import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const AboutContainer = styled.div`

`;

class About extends React.Component {
  componentDidMount() {}

  render() {
    return <AboutContainer>About</AboutContainer>;
  }
}

About.propTypes = {
  store: PropTypes.object
};

export default About;