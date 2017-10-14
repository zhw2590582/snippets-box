import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import {
  Spin,
  Icon,
  Tooltip,
  Modal,
  notification,
  Button,
  Input,
  Select
} from 'antd';
import Setting from './Setting';
import { redirect_uri } from '../config';

const InputGroup = Input.Group;
const Search = Input.Search;
const Option = Select.Option;

const HeaderContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 99;
  width: 100%;
  height: ${props => props.theme.headerHeight};
  line-height: ${props => props.theme.headerHeight};
  background: ${props => props.theme.headerBg};
  border-bottom: 1px solid ${props => props.theme.borderColor};

  .header-left {
    width: ${props => props.theme.sidebarWidth};
    padding-left: 15px;
    border-right: 1px solid ${props => props.theme.borderColor};
    .logo {
      display: block;
      img {
        margin: 10px 15px 0 0;
      }
      span {
        font-size: 16px;
        color: #666;
      }
      &:hover {
        opacity: 0.75;
      }
    }
  }

  .header-search {
    padding-left: 15px;
  }

  .header-right {
    .item{
      margin-right: 20px;
      color: #999;
      &:hover{
        color: #108ee9;
      }
    }
    .creat{
      padding-right: 20px;
      border-right: 1px solid ${props => props.theme.borderColor};
    }
    .refresh{

    }
    .setting{

    }
    .about{
      padding-right: 20px;
      border-right: 1px solid ${props => props.theme.borderColor};
    }
    .name{

    }
    .logout{

    }
  }
`;

@inject('store')
@observer
class Header extends React.Component {
  state = { settingVisible: false };

  // 搜索
  search = value => {
    console.log(value);
  };

  // 刷新
  reload = event => {
    event.preventDefault();
    this.props.store.setLoading(true);
    this.props.store.getGists(() => {
      notification.success({
        message: 'Notification',
        description: 'Refresh Gists Success'
      });
      this.props.store.setLoading(false);
    });
  };

  // 关于
  about = event => {
    event.preventDefault();
  };

  // 设置
  setting = event => {
    event.preventDefault();
    this.setState({
      settingVisible: true
    });
  };

  // 设置 -- Ok
  settingOk = event => {
    this.setState({
      settingVisible: false
    });
  };

  // 设置 -- Cancel
  settingCancel = event => {
    this.setState({
      settingVisible: false
    });
  };

  // 登出
  logout = event => {
    event.preventDefault();
    let that = this;
    Modal.confirm({
      title: 'Logout',
      content: 'Are you sure you are logged out?',
      onOk() {
        that.props.store.logout(() => {
          notification.success({
            message: 'Notification',
            description: 'Sign Out Successful！'
          });
        });
      },
      onCancel() {}
    });
  };

  componentDidMount() {}

  render() {
    let { userInfo } = this.props.store;
    return (
      <HeaderContainer className="clearfix">
        <div className="header-left fl">
          <a className="logo clearfix" href={redirect_uri}>
            <img
              className="fl"
              width="30"
              height="30"
              alt="logo"
              src={require('../images/icon-48.png')}
            />
            <span className="fl">Snippets Box</span>
          </a>
        </div>
        <div className="header-search fl">
          <Search
            placeholder="Search by keyword or #label"
            style={{ width: 300 }}
            onSearch={this.search}
          />
        </div>
        <div className="header-right fr clearfix">
          <div className="item creat fl">
            <Button type="primary" icon="file">
              New Gist
            </Button>
          </div>
          <Tooltip placement="bottom" title="Refresh Gists">
            <a className="item refresh fl" href="#" onClick={this.reload}>
              <Icon type="reload" />
            </a>
          </Tooltip>
          <Tooltip placement="bottom" title="Setting">
            <a className="item setting fl" href="#" onClick={this.setting}>
              <Icon type="setting" />
            </a>
          </Tooltip>
          <Tooltip placement="bottom" title="About">
            <a className="item about fl" href="#" onClick={this.about}>
              <Icon type="question-circle-o" />
            </a>
          </Tooltip>
          <Tooltip placement="bottom" title="Open Github Gist">
            <a
              className="item name fl"
              href={`https://gist.github.com/${userInfo.login}`}
              target="_blank"
            >
              <Icon type="github" />
              {userInfo.login}
            </a>
          </Tooltip>
          <a className="item logout fl" href="#" onClick={this.logout}>
            <Icon type="logout" />
            Logout
          </a>
        </div>
        <Modal
          title="Setting"
          visible={this.state.settingVisible}
          onOk={this.settingOk}
          onCancel={this.settingCancel}
        >
          <Setting />
        </Modal>
      </HeaderContainer>
    );
  }
}

Header.propTypes = {
  store: PropTypes.object
};

export default Header;
