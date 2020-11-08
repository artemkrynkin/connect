// Use only in a secure environment
const IS_PROD = process.env.NODE_ENV === 'production';

const DEV_CONFIG = {
	dbConnectionName: 'Username-Password-Authentication',
	clientId: '4pmdOXEv0seOwvHscw6vUE8VnzQESUWA',
	clientSecret: 'RAIIhdxbrRfQAiXvVAHX_mw5Kln9wEXQOl9mmGHi3CZ2kK1Z9lSditTRQjYn6wkr',
	domain: 'keeberinkdev.eu.auth0.com',
	audience: 'https://keeberinkdev.eu.auth0.com/api/v2/',
	redirectUri: 'http://localhost:3003/auth/loginCallback',
};

const PRODUCTION_CONFIG = {
	dbConnectionName: 'Username-Password-Authentication',
	clientId: '4pmdOXEv0seOwvHscw6vUE8VnzQESUWA',
	clientSecret: 'RAIIhdxbrRfQAiXvVAHX_mw5Kln9wEXQOl9mmGHi3CZ2kK1Z9lSditTRQjYn6wkr',
	domain: 'keeberinkdev.eu.auth0.com',
	audience: 'https://keeberinkdev.eu.auth0.com/api/v2/',
	redirectUri: 'https://account.keeberink.com/auth/loginCallback',
};

export const config = IS_PROD ? PRODUCTION_CONFIG : DEV_CONFIG;
