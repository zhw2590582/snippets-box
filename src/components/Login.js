import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import { client_id, redirect_uri } from '../config';
import { notification, Icon, Spin } from 'antd';
import { version } from '../../package.json';
import { getQueryString } from '../utils';

const LoginContainer = styled.div`
  height: 100%;
  background: #fafafa url(${require('../images/login-bg.png')});

  .login-box {
    position: absolute;
    top: 40%;
    left: 50%;
    width: 340px;
    margin: -150px 0 0 -170px;
    padding: 30px;
    background: #fff;
    border-radius: 5px;
    text-align: center;
    box-shadow: 0 0 1px 0 hsla(0, 0%, 7%, 0.25);
    border: 5px solid rgba(0, 0, 0, 0.05);

    .login-header {
      margin-bottom: 30px;
      img {
        width: 70px;
        margin-bottom: 10px;
      }
      .name {
        font-size: 20px;
        color: #000;
        margin-bottom: 10px;
        .version {
          margin-left: 10px;
          color: #999;
          font-size: 14px;
        }
      }
      .description {
        color: #999;
      }
    }

    .login-btn {
      display: inline-block;
      padding: 6px 12px;
      font-size: 14px;
      font-weight: 600;
      line-height: 20px;
      border: 1px solid rgba(27, 31, 35, 0.2);
      border-radius: 0.25em;
      color: #24292e;
      background-color: #eff3f6;
      background-image: linear-gradient(-180deg, #fafbfc 0%, #eff3f6 90%);
      transition: none;

      &:hover {
        background-color: #e6ebf1;
        background-image: linear-gradient(-180deg, #f0f3f6 0%, #e6ebf1 90%);
        background-position: 0 -0.5em;
        border-color: rgba(27, 31, 35, 0.35);
      }

      .anticon {
        margin-right: 10px;
      }
    }

    .loading {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      padding-top: 120px;
      background: rgba(255, 255, 255, 0.8);
    }
  }
`;

@inject('store')
@observer
class Login extends React.Component {
  componentDidMount() {
    const code = getQueryString('code');
    if (code) {
      this.props.store.getUserInfo(code, () => {
        notification.success({
          message: 'Notification',
          description: 'Login Successful!'
        });
      });
    }
  }

  render() {
    return (
      <LoginContainer>
        <div className="login-box">
          <div className="login-header">
            <img
              className="logo"
              alt="logo"
              src={require('../images/icon-128.png')}
            />
            <p className="name">
              SnippetsBox<span className="version">{version}</span>
            </p>
            <p className="description">Snippet manager based on GitHub Gist</p>
          </div>
          <a
            className="login-btn"
            href={`https://github.com/login/oauth/authorize?client_id=${client_id}&state=SnippetsBox&redirect_uri=${redirect_uri}&scope=gist`}
          >
            <Icon type="github" />
            Sign up with Github
          </a>
          {this.props.store.logging && (
            <div className="loading">
              <Spin size="large" tip="Logging..." />
            </div>
          )}
        </div>
      </LoginContainer>
    );
  }
}

Login.propTypes = {
  store: PropTypes.object
};

export default Login;
