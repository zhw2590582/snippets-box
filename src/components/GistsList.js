'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import Gist from './Gist';

const GistsListContainer = styled.div`
  position: fixed;
  z-index: 99;  
  left: 220px;
  top: 50px;
  bottom: 0;
  z-index: 91;
  width: 350px;
  height: 100%;
  background: #ffffff;
  border-right: 1px solid #e5e5e5;
  overflow-x: hidden;
  overflow-y: auto;
`;

class GistsList extends React.Component {
  render() {
    let { allGists, gistsByTag } = this.props.store;
    return (
      <GistsListContainer>
        <Gist list={allGists} />
        <Gist list={gistsByTag} />
      </GistsListContainer>
    );
  }
}

// GistsList.propTypes = {
//   store: PropTypes.object.isRequired,
// };

export default inject('store')(observer(GistsList));