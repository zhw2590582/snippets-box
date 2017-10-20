import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import Gist from './Gist';
import { Scrollbars } from 'react-custom-scrollbars';
import { Icon, Radio, Checkbox } from 'antd';

const GistsListContainer = styled.div`
  position: fixed;
  z-index: 99;
  left: ${props => props.theme.sidebarWidth}px;
  top: 0;
  bottom: 0;
  padding-top: ${props => props.theme.headerHeight}px;
  z-index: 91;
  width: ${props => props.theme.gistsListWidth}px;
  height: 100%;
  background: ${props => props.theme.gistsListBg};
  border-right: 1px solid ${props => props.theme.borderColor};
  .sort {
    padding: 10px;
    border-bottom: 1px solid ${props => props.theme.borderColor};
    background: #f5f9fc;
  }
  .noGists {
    color: #999;
    text-align: center;
    margin-top: 50px;
    .anticon {
      margin-right: 10px;
    }
  }
`;

@inject('store')
@observer
class GistsList extends React.Component {
  sortChange = e => {
    let { setLoading, setSelected, setEditMode } = this.props.store;
    setEditMode(false);
    setLoading(true);
    setSelected(
      {
        public: e.target.value
      },
      this.props.store.options.fromCache
    );
  };

  updatedChange = e => {
    let { setLoading, setSelected, setEditMode } = this.props.store;
    setEditMode(false);
    setLoading(true);
    setSelected(
      {
        updated: !this.props.store.selected.updated
      },
      this.props.store.options.fromCache
    );
  };

  render() {
    let { gistsList, selected } = this.props.store;
    return (
      <GistsListContainer>
        <Scrollbars>
          <div className="sort clearfix">
            <div className="fl">
              <Radio.Group
                value={selected.public}
                onChange={this.sortChange}
                size="small"
              >
                <Radio.Button value="all">All</Radio.Button>
                <Radio.Button value="public">Public</Radio.Button>
                <Radio.Button value="private">Private</Radio.Button>
              </Radio.Group>
            </div>
            <div className="fr">
              <Checkbox
                checked={selected.updated}
                onChange={this.updatedChange}
              >
                Updated
              </Checkbox>
            </div>
          </div>
          {gistsList.length > 0 ? (
            <Gist list={gistsList} />
          ) : (
            <div className="noGists">
              <Icon type="frown-o" />No gists match your filters
            </div>
          )}
        </Scrollbars>
      </GistsListContainer>
    );
  }
}

GistsList.propTypes = {
  store: PropTypes.object
};

export default GistsList;
