'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import Filter from './Filter';

const SidebarContainer = styled.div`
  position: fixed;
  z-index: 98;
  top: 50px;
  left: 0;
  right: 0;
  width: 220px;
  height: 100%;
  background: #ffffff;
  border-right: 1px solid #e5e5e5;
  overflow-x: hidden;
  overflow-y: auto;
`;

class Sidebar extends React.Component {
  render() {
    let {
      getLanguages,
      getTags,
      getLanguagesLength,
      getTagsLength,
      getGistsByLanguage,
      getGistsByTag
    } = this.props.store;
    return (
      <SidebarContainer className="fl">
        {getTagsLength > 0 && (
          <Filter
            filterName="tag"
            filterList={getTags}
            length={getTagsLength}
            filterFn={getGistsByTag}
          />
        )}
        {getLanguagesLength > 0 && (
          <Filter
            filterName="language"
            filterList={getLanguages}
            length={getLanguagesLength}
            filterFn={getGistsByLanguage}
          />
        )}
      </SidebarContainer>
    );
  }
}

Sidebar.propTypes = {
  store: PropTypes.object,
};

export default inject('store')(observer(Sidebar));