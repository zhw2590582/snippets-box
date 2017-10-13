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
  height: 50px;
  line-height: 50px;
  padding: 0 15px;
  background: #333;

  a {
    color: #fff;
    &:hover {
      opacity: 0.6;
    }
  }

  .logo {
    font-size: 18px;
    img {
      width: 30px;
      height: 30px;
      margin: 10px 10px 0 0;
    }
  }

  .header-right {
    .creat {
      margin-right: 15px;
    }
    .search {
      padding-left: 15px;
      border-left: 1px solid #585858;
      width: 235px;
    }
    .tools {
      padding-left: 15px;
      border-left: 1px solid #585858;
      a {
        margin-right: 15px;
      }
    }
    .profile {
      padding-left: 15px;
      border-left: 1px solid #585858;
      .anticon {
        margin-right: 5px;
      }
      .name {
        margin-right: 20px;
      }
    }
  }
`;

@inject('store')
@observer
class Header extends React.Component {
  state = { settingVisible: false };

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

  about = event => {
    event.preventDefault();
  };

  setting = event => {
    event.preventDefault();
    this.setState({
      settingVisible: true
    });
  };

  settingOk = event => {
    this.setState({
      settingVisible: false
    });
  };

  settingCancel = event => {
    this.setState({
      settingVisible: false
    });
  };

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
            description: 'Sign Out Successful'
          });
        });
      },
      onCancel() {
        console.log('Cancel');
      }
    });
  };

  componentDidMount() {
    //console.log(this.props.store);
  }

  render() {
    let { userInfo } = this.props.store;
    return (
      <HeaderContainer className="clearfix">
        <a
          className="logo fl clearfix"
          href="/"
        >
          <img className="fl" src={require('../images/icon-128.png')} />
          <span className="fl">SnippetsBox</span>
        </a>
        <div className="header-right fr clearfix">
          <div className="creat fl">
            <Button type="primary" icon="file">
              New Gist
            </Button>
          </div>
          <div className="search fl">
            <InputGroup compact>
              <Select defaultValue="Gists">
                <Option value="Gists">Gists</Option>
                <Option value="files">files</Option>
                <Option value="Labels">Labels</Option>
              </Select>
              <Search
                placeholder="Search by keyword"
                style={{ width: 150 }}
                onSearch={value => console.log(value)}
              />
            </InputGroup>
          </div>
          <div className="tools fl">
            <Tooltip placement="bottom" title="Refresh Gists">
              <a href="#" onClick={this.reload}>
                <Icon type="reload" />
              </a>
            </Tooltip>
            <Tooltip placement="bottom" title="Setting">
              <a href="#" onClick={this.setting}>
                <Icon type="setting" />
              </a>
            </Tooltip>
            <Tooltip placement="bottom" title="About">
              <a href="#" onClick={this.about}>
                <Icon type="question-circle-o" />
              </a>
            </Tooltip>
          </div>
          <div className="profile fl">
            <Tooltip placement="bottom" title="Open Github Gist">
              <a
                className="name"
                href={`https://gist.github.com/${userInfo.login}`}
                target="_blank"
              >
                <Icon type="github" />
                {userInfo.login}
              </a>
            </Tooltip>
            <a href="#" onClick={this.logout}>
              <Icon type="logout" />
              Logout
            </a>
          </div>
        </div>
        <Modal
          title="Setting"
          visible={this.state.settingVisible}
          onOk={this.settingOk}
          onCancel={this.settingCancel}
        >
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Modal>
      </HeaderContainer>
    );
  }
}

Header.propTypes = {
  store: PropTypes.object
};

export default Header;
