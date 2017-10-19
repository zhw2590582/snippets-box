import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import moment from 'moment';
import { Icon, Tooltip } from 'antd';

const GistContainer = styled.div`
  .item {
    padding: 10px;
    border-bottom: 1px solid ${props => props.theme.borderColor};
    &:hover,
    &.selected {
      background: #f7f7f7;
    }
    .name {
      font-size: 16px;
      color: #000;
      .avatar {
        width: 20px;
        vertical-align: text-top;
        border-radius: 50%;
        margin-right: 5px;
      }
      .anticon {
        font-size: 14px;
        margin-right: 5px;
      }
    }
    .date {
      font-size: 12px;
      color: #999;
    }
    .description {
      font-size: 14px;
      color: #666;
      margin: 10px 0;
    }
    .tags {
      font-size: 12px;
      color: #999;
      span {
        margin-right: 10px;
        margin-bottom: 5px;
        .anticon {
          margin-right: 5px;
        }
      }
    }
  }
`;

@inject('store')
@observer
class Gist extends React.Component {
  getGistsOpen = id => {
    this.props.store.setLoading(true);
    this.props.store.setEditMode(false);
    this.props.store.getGistsOpen(id);
  };

  render() {
    let { list, editGistInfo } = this.props;
    let { selected } = this.props.store;
    return (
      <GistContainer>
        {list.map(gist => {
          return (
            <div
              className={`item hand ${selected.id == gist.id
                ? 'selected'
                : ''}`}
              key={gist.id}
              data-gist={gist.id}
              data-selected={selected.id}              
              onClick={this.getGistsOpen.bind(this, gist.id)}
            >
              <div className="name text-ellipsis">
                <img className="avatar" src={gist.owner.avatar_url} />
                {gist.public ? (
                  <Tooltip placement="bottom" title="Public">
                    <Icon type="unlock" />
                  </Tooltip>
                ) : (
                  <Tooltip placement="bottom" title="Private">
                    <Icon type="lock" />
                  </Tooltip>
                )}
                {gist.name || 'No Name'}
              </div>
              <div className="date">
                Created: {moment(gist.created_at).format('YYYY-MM-DD HH:mm:ss')}
              </div>
              <div className="description text-ellipsis">
                {gist.description || 'No Description'}
              </div>
              <div className="tags clearfix">
                {gist.tags.length > 0 ? (
                  gist.tags.map(tag => (
                    <span className="fl" key={tag}>
                      <Icon type="tags" />
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="fl">
                    <Icon type="tags" />No Labels
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </GistContainer>
    );
  }
}

Gist.propTypes = {
  store: PropTypes.object,
  list: PropTypes.object.isRequired
};

export default Gist;
