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
import { isProduction } from '../utils';
import { getStorage, delStorage } from '../utils/storage';
import DevTools from 'mobx-react-devtools';

const AppContainer = styled.div`
  height: 100%;
  background: #fff;
  font-size: 14px;
`;

@inject('store')
@observer
class App extends React.Component {
  componentDidMount() {
    let { setToken, setUserInfo, reset, createGist } = this.props.store;

    // 同步用户信息
    getStorage('userInfo', storage => {
      if (!storage) return;
      setUserInfo(storage);
    });

    // 同步access_token
    getStorage('access_token', storage => {
      if (!storage) return;
      setToken(storage, () => {
        reset();
      });
    });

    // 菜单创建Gist --- 从缓存
    getStorage('gistCache', storage => {
      if (!storage) return;
      if (this.props.store.userInfo) {
        createGist(storage.gistCache);
        delStorage('gistCache');
      } else {
        notification.error({
          message: 'Notification',
          description: 'Please Login!'
        });
      }
    });

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
        {!isProduction && <DevTools />}
      </AppContainer>
    ) : (
      <Login />
    );
  }
}

App.propTypes = {
  store: PropTypes.object
};

export default App;
