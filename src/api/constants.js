export const IS_PROD = process.env.NODE_ENV === 'production';

export const SERVER_URL = IS_PROD ? '' : 'http://localhost:3003';

export const CLIENT_URL = IS_PROD ? `${window.location.protocol}//${window.location.host}` : 'http://localhost:3002';
