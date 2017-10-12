'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import { notification } from 'antd';
import Login from './Login';
import Header from './Header';
import Sidebar from './Sidebar';
import GistsList from './GistsList';
import Content from './Content';
import Loading from './Loading';

const AppContainer = styled.div`
  height: 100%;
  background: #fff;
  font-size: 14px;
`;

class App extends React.Component {
  componentDidMount() {
    let { setToken, setUserInfo, reset, createGist } = this.props.store;

    // // 同步用户信息
    // chrome.storage.local.get('userInfo', storage => {
    //   storage.userInfo && setUserInfo(storage.userInfo);
    // });

    // // 同步access_token
    // chrome.storage.local.get('access_token', storage => {
    //   storage.access_token &&
    //     setToken(storage.access_token, () => {
    //       reset();
    //     });
    // });

    // // 菜单创建Gist --- 从缓存
    // chrome.storage.local.get('gistCache', storage => {
    //   if(!storage.gistCache) return;
    //   if(this.props.store.userInfo){
    //     createGist(storage.gistCache);
    //     chrome.storage.local.remove('gistCache');
    //   } else {
    //     notification.error({
    //       message: 'Notification',
    //       description: 'Please Login!'
    //     });
    //   }
    // })
    
    // // 菜单创建Gist --- 从postMessage
    // chrome.runtime.onConnect.addListener(port => {
    //   port.onMessage.addListener(gistCache => {
    //     if(gistCache.type !== 'creatGist') return;
    //     if(this.props.store.userInfo){
    //       createGist(gistCache);
    //     } else {
    //       notification.error({
    //         message: 'Notification',
    //         description: 'Please Login!'
    //       });
    //     }
    //   });
    // });
  }

  render() {
    let { isLoading, userInfo, openGist } = this.props.store;
    return userInfo ? (
      <AppContainer>
        <Header />
        <Sidebar />
        <GistsList />
        {openGist && <Content />}
        {isLoading && <Loading />}
      </AppContainer>
    ) : (
      <Login />
    );
  }
}

App.propTypes = {
  store: PropTypes.object
};

export default inject('store')(observer(App));
