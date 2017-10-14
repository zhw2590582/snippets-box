import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import Gist from './Gist';
import { Scrollbars } from 'react-custom-scrollbars';

const GistsListContainer = styled.div`
  position: fixed;
  z-index: 99;
  left: ${props => props.theme.sidebarWidth};
  top: 0;
  bottom: 0;
  padding-top: ${props => props.theme.headerHeight};
  z-index: 91;
  width: ${props => props.theme.gistsListWidth};
  height: 100%;
  background: ${props => props.theme.gistsListBg};
  border-right: 1px solid ${props => props.theme.borderColor};
`;

@inject('store')
@observer
class GistsList extends React.Component {
  render() {
    let { gistsList } = this.props.store;
    return (
      <GistsListContainer>
        <Scrollbars>
          <Gist list={gistsList} />
        </Scrollbars>
      </GistsListContainer>
    );
  }
}

GistsList.propTypes = {
  store: PropTypes.object
};

export default GistsList;
