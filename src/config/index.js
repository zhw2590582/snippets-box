import { isProduction } from '../utils';
export const client_id = '66543c50e5b17383ced7';
export const client_secret = 'cc111d53437974874655a7363d278201115bbf47';
export const redirect_uri = isProduction ? 'https://blog.zhw-island.com/snippets-box/' : 'http://localhost:3000/';
