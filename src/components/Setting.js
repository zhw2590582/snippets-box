import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import { Switch, notification } from 'antd';

const SettingContainer = styled.div`
  font-size: 14px;
  color: #666;
  .item {
    margin-bottom: 5px;
    .name {
      margin-right: 10px;
    }
  }
`;

@inject('store')
@observer
class Setting extends React.Component {
  settingChange = (name, val) => {
    let { setOptions } = this.props.store;
    setOptions(
      {
        [name]: val
      },
      () => {
        notification.success({
          message: 'Notification',
          description: 'Save Setting Success!'
        });
      }
    );
  };

  render() {
    let { options } = this.props.store;
    return (
      <SettingContainer>
        <div className="item clearfix">
          <p className="name fl">Update From Memory</p>
          <p className="info fr">
            <Switch
              checked={options.fromCache}
              onChange={this.settingChange.bind(this, 'fromCache')}
            />
          </p>
        </div>
      </SettingContainer>
    );
  }
}

Setting.propTypes = {
  store: PropTypes.object
};

export default Setting;
