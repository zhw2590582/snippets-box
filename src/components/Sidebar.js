import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import Filter from './Filter';
import { Scrollbars } from 'react-custom-scrollbars';
import { Icon } from 'antd';

const SidebarContainer = styled.div`
  position: fixed;
  z-index: 98;
  top: 0;
  left: 0;
  right: 0;
  padding-top: ${props => props.theme.headerHeight};
  width: ${props => props.theme.sidebarWidth};
  height: 100%;
  background: ${props => props.theme.sidebarBg};
  border-right: 1px solid ${props => props.theme.borderColor};

  .filter {
    margin-bottom: 30px;
    .title {
      font-size: 16px;
      height: 40px;
      line-height: 40px;
      padding: 0 15px;
      border-bottom: 1px solid ${props => props.theme.borderColor};
    }
    .item {
      color: #666;
      display: block;
      height: 35px;
      line-height: 35px;
      padding: 0 15px;
      border-left: 2px solid #ffffff;
      .num {
        color: #999;
      }
      &:hover {
        color: #108ee9;
      }
      &.selected {
        color: #108ee9;
        background: #ecf6fd;
        border-left: 2px solid #108ee9;
      }
    }
  }
`;

@inject('store')
@observer
class Sidebar extends React.Component {
  render() {
    let {
      selected,
      allGists,
      getGists,
      userInfo,
      getLanguages,
      getTags,
      getLanguagesLength,
      getTagsLength,
      getGistsByLanguage,
      getGistsByTag
    } = this.props.store;
    return (
      <SidebarContainer>
        <Scrollbars className="scrollbars">
          <div className="filter">
            <div className="title">
              <Icon type="tags-o" />
              {` Favorites`}
            </div>
            <div
              className={`item hand clearfix ${selected.type == 'all'
                ? 'selected'
                : ''}`}
              onClick={getGists.bind(this)}
            >
              <span className="fl name"># My Gists</span>
              <span className="fr num">{allGists.length}</span>
            </div>
            <a
              href={`https://gist.github.com/${userInfo.login}/starred`}
              className="item clearfix hand"
              target="_blank"
            >
              <span className="fl name"># Starred</span>
            </a>
          </div>
          <Filter
            filterName="tag"
            filterList={getTags}
            length={getTagsLength}
            filterFn={getGistsByTag}
          />
          <Filter
            filterName="language"
            filterList={getLanguages}
            length={getLanguagesLength}
            filterFn={getGistsByLanguage}
          />
        </Scrollbars>
      </SidebarContainer>
    );
  }
}

Sidebar.propTypes = {
  store: PropTypes.object
};

export default Sidebar;
