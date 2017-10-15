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
import About from './About';
import { redirect_uri } from '../config';
import { version } from '../../package.json';

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
  height: ${props => props.theme.headerHeight}px;
  line-height: ${props => props.theme.headerHeight}px;
  background: ${props => props.theme.headerBg};
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.07);

  .header-left {
    width: ${props => props.theme.sidebarWidth}px;
    padding-left: 15px;
    border-right: 1px solid ${props => props.theme.borderColor};
    background: ${props => props.theme.logoBg};
    .logo {
      display: block;
      color: #fff;
      img {
        width: 30px;
        height: 30px;
        margin: 10px 15px 0 0;
      }
      span {
        font-size: 16px;
      }
      .version{
        margin-left:5px;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.5);
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
    .item {
      margin-right: 20px;
      color: #999;
      &:hover {
        color: ${props => props.theme.primary};
      }
    }
    .creat {
      padding-right: 20px;
      border-right: 1px solid ${props => props.theme.borderColor};
    }
    .refresh {
    }
    .setting {
    }
    .about {
      padding-right: 20px;
      border-right: 1px solid ${props => props.theme.borderColor};
    }
    .name {
      img {
        width: 30px;
        height: 30px;
        margin: 10px 10px 0 0;
        border-radius: 50%;
      }
    }
    .logout {
      .anticon {
        margin-right: 10px;
      }
    }
  }
`;

@inject('store')
@observer
class Header extends React.Component {
  state = {
    settingModal: false,
    aboutModal: false
  };

  // 搜索
  search = value => {
    console.log(value);
  };

  // 创建
  creat = () => {};

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
    Modal.info({
      title: 'About Snippets Box',
      content: <About />,
      onOk() {}
    });
  };

  // 设置
  setting = event => {
    event.preventDefault();
    this.setState({
      settingModal: true
    });
  };

  // 设置 -- Ok
  settingOk = event => {
    this.setState({
      settingModal: false
    });
  };

  // 设置 -- Cancel
  settingCancel = event => {
    this.setState({
      settingModal: false
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

  render() {
    let { userInfo } = this.props.store;
    return (
      <HeaderContainer className="clearfix">
        <div className="header-left fl">
          <a className="logo clearfix" href={redirect_uri}>
            <img
              className="fl"
              alt="logo"
              src={require('../images/icon-48.png')}
            />
            <span className="fl">
              Snippets Box
              <span className="version">{version}</span>
            </span>
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
            <Button type="primary" icon="file" onClick={this.creat}>
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
              <img className="fl" src={userInfo.avatar_url} />
              <span className="fl">{userInfo.login}</span>
            </a>
          </Tooltip>
          <Tooltip placement="bottom" title="Logout">
            <a className="item logout fl" href="#" onClick={this.logout}>
              <Icon type="logout" />
            </a>
          </Tooltip>
        </div>
        <Modal
          title="Setting"
          visible={this.state.settingModal}
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
