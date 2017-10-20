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
import Editor from './Editor';
import Loading from './Loading';
import { redirect_uri } from '../config';
import { isProduction } from '../utils';
import DevTools from 'mobx-react-devtools';

const AppContainer = styled.div`
  height: 100%;
  font-size: 14px;
  background: ${props => props.theme.bodyBg};
`;

@inject('store')
@observer
class App extends React.Component {
  componentDidMount() {
    // 菜单创建Gist
    let { userInfo, createGistByMenu } = this.props.store;
    document.body.addEventListener('__snippets_box_hood__', e => {
      if (e.target.baseURI !== redirect_uri || e.detail.type !== 'creatGist') return;
      if (userInfo) {
        createGistByMenu(e.detail);
      } else {
        notification.error({
          message: 'Notification',
          description: 'Please login first!'
        });
      }
    });
  }

  render() {
    let { isLoading, userInfo, editMode } = this.props.store;
    return userInfo ? (
      <AppContainer>
        <Header />
        <Sidebar />
        <GistsList />
        {editMode ? <Editor /> : <Content />}
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
