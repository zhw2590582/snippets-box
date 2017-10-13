import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { useStrict } from 'mobx';
import { Provider } from 'mobx-react';
import { AppContainer } from 'react-hot-loader';
import { rehydrate, hotRehydrate } from 'rfx-core';
import 'promise-polyfill';
import 'whatwg-fetch';
import stores from './stores';
import App from './components/App';
import { ThemeProvider } from 'styled-components';
import theme from './styles/theme';
import 'normalize.css';
import './styles/global';
import { isProduction } from './utils';

useStrict(true);
const store = rehydrate().stores;

const renderApp = Component => {
  render(
    <AppContainer>
      <Provider store={isProduction ? store : hotRehydrate()}>
        <ThemeProvider theme={theme}>
          <Component />
        </ThemeProvider>
      </Provider>
    </AppContainer>,
    document.getElementById('root')
  );
};

renderApp(App);

if (module.hot) {
  module.hot.accept(() => renderApp(App));
}
