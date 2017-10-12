import React from 'react';
import { render } from 'react-dom';
import { useStrict } from 'mobx';
import { Provider } from 'mobx-react';
import 'promise-polyfill';
import 'whatwg-fetch';
import store from './stores';
import App from './components/App';
import { ThemeProvider } from 'styled-components';
import theme from './styles/theme';
import 'normalize.css';
import './styles/global';

useStrict(true);

render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </Provider>,
  document.getElementById('app')
);
