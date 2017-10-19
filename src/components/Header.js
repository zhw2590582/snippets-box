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
    height: ${props => props.theme.headerHeight}px;
    padding-left: 15px;
    border-right: 1px solid ${props => props.theme.borderColor};
    background: ${props => props.theme.logoBg};
    .logo {
      display: block;
      color: #fff;
      img {
        width: 30px;
        height: 30px;
        margin: 10px 10px 0 0;
      }
      span {
        font-size: 16px;
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
      .ant-btn {
        margin-left: 15px;
      }
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
    timer: 0,
    settingModal: false,
    aboutModal: false
  };

  // 立即搜索
  onSearch = value => {
    clearTimeout(this.state.timer);
    this.props.store.searchGist(value);
  };

  // 延迟执行函数
  throttle = (fn, delay) => {
    clearTimeout(this.state.timer);
    this.setState({
      timer: setTimeout(() => {
        fn();
      }, delay)
    });
  };

  // 监听搜索
  onInput = e => {
    let value = e.target.value;
    this.throttle(() => {
      this.props.store.searchGist(value);
    }, 500);
  };

  // 创建
  creat = () => {
    this.props.store.setEditMode(true);
  };

  // 取消编辑
  cancel = () => {
    this.props.store.setEditMode(false);
  };

  // 保存编辑
  save = () => {
    this.props.store.setLoading(true);
    this.props.store.saveGist(() => {
      notification.success({
        message: 'Notification',
        description: 'Save Gist Success'
      });
    });
  };

  // 刷新
  reload = event => {
    event.preventDefault();
    this.props.store.setLoading(true);
    this.props.store.reset(() => {
      notification.success({
        message: 'Notification',
        description: 'Refresh Gists Success'
      });
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
      title: 'Are you logged out?',
      content: '',
      onOk() {
        this.props.store.logout(() => {
          notification.success({
            message: 'Notification',
            description: 'Logged Out Successful！'
          });
        });      },
      onCancel() {
        console.log('Cancel');
      }
    });
  };

  render() {
    let { userInfo, editMode } = this.props.store;
    return (
      <HeaderContainer className="clearfix">
        <div className="header-left fl">
          <a className="logo clearfix" href={redirect_uri}>
            <img
              className="fl"
              alt="logo"
              src={require('../images/icon-48.png')}
            />
            <span className="fl">Snippets Box</span>
          </a>
        </div>
        <div className="header-search fl">
          <Search
            placeholder="Search by name | description | tag | filename"
            style={{ width: 300 }}
            maxLength="100"
            onInput={this.onInput}
            onSearch={this.onSearch}
          />
        </div>
        <div className="header-right fr clearfix">
          <div className="item creat fl">
            {editMode ? (
              <div>
                <Button type="danger" icon="close" onClick={this.cancel}>
                  Cancel
                </Button>
                <Button type="primary" icon="save" onClick={this.save}>
                  Save
                </Button>
              </div>
            ) : (
              <Button type="primary" icon="file" onClick={this.creat}>
                New Gist
              </Button>
            )}
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
          width={350}
          visible={this.state.settingModal}
          onCancel={this.settingCancel}
          footer={null}
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
