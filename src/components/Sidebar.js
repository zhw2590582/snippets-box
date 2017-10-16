import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import { Scrollbars } from 'react-custom-scrollbars';
import { Icon } from 'antd';

const SidebarContainer = styled.div`
  position: fixed;
  z-index: 98;
  top: 0;
  left: 0;
  right: 0;
  padding-top: ${props => props.theme.headerHeight}px;
  width: ${props => props.theme.sidebarWidth}px;
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
      border-bottom: 1px solid #222e38;
      color: #afafaf;
    }
    .item {
      color: #fff;
      display: block;
      height: 35px;
      line-height: 35px;
      padding: 0 15px;
      .num {
        color: #ccc;
      }
      &:hover,
      &.selected {
        color: #fff;
        background: ${props => props.theme.primary};
      }
    }
  }
`;

@inject('store')
@observer
class Sidebar extends React.Component {
  setSelected = opt => {
    Object.assign(opt, {
      id: '', // 当前选中gist
      public: 'all', // 公开排序
      updated: false, // 更新排序
      keywork: '' // 关键词
    });
    this.props.store.setLoading(true);
    this.props.store.setSelected(opt);
  };

  render() {
    let { selected, allGists, allStarred, getTags } = this.props.store;
    return (
      <SidebarContainer>
        <Scrollbars className="scrollbars">
          <div className="filter">
            <div className="title">
              <Icon type="star-o" />
              {` Favorites`}
            </div>
            <div
              className={`item hand clearfix ${selected.type == 'all'
                ? 'selected'
                : ''}`}
              onClick={this.setSelected.bind(this, { type: 'all' })}
            >
              <span className="fl name"># My Gists</span>
              <span className="fr num">{allGists.length}</span>
            </div>
            <div
              className={`item hand clearfix ${selected.type == 'starred'
                ? 'selected'
                : ''}`}
              onClick={this.setSelected.bind(this, { type: 'starred' })}
            >
              <span className="fl name"># Starred</span>
              <span className="fr num">{allStarred.length}</span>
            </div>
          </div>
          <div className="filter">
            <div className="title">
              <Icon type="tags-o" />
              {` All Tags`}
            </div>
            {Object.keys(getTags).map(item => {
              return (
                <div
                  className={`item hand clearfix ${selected.type == 'tag' &&
                  selected.tagName == item
                    ? 'selected'
                    : ''}`}
                  key={item}
                  onClick={this.setSelected.bind(this, {
                    type: 'tag',
                    tagName: item
                  })}
                >
                  <span className="fl name"># {item}</span>
                  <span className="fr num">{getTags[item]}</span>
                </div>
              );
            })}
          </div>
        </Scrollbars>
      </SidebarContainer>
    );
  }
}

Sidebar.propTypes = {
  store: PropTypes.object
};

export default Sidebar;
