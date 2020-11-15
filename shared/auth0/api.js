// Use only in a secure environment
const IS_PROD = process.env.NODE_ENV === 'production';

const DEV_CONFIG = {
	dbConnectionName: 'Username-Password-Authentication',
	clientId: 'J7H0qGhB0ZwM4d0bGV24Px4l675Yr9WI',
	clientSecret: 'N7PnbvlD8Xwl2rv6Af6JlBvUWTO8Jod1mqVem61i6fl0n4aLYWgaYeGIjEH9m8hW',
	domain: 'keeberinklocal.eu.auth0.com',
	audience: 'https://keeberinklocal.eu.auth0.com/api/v2/',
	redirectUri: 'http://localhost:3003/auth/loginCallback',
	jwksUri: 'https://keeberinklocal.eu.auth0.com/.well-known/jwks.json',
	issuer: 'https://keeberinklocal.eu.auth0.com/',
};

const PRODUCTION_CONFIG = {
	dbConnectionName: 'Username-Password-Authentication',
	clientId: '4pmdOXEv0seOwvHscw6vUE8VnzQESUWA',
	clientSecret: 'RAIIhdxbrRfQAiXvVAHX_mw5Kln9wEXQOl9mmGHi3CZ2kK1Z9lSditTRQjYn6wkr',
	domain: 'keeberinkdev.eu.auth0.com',
	audience: 'https://keeberinkdev.eu.auth0.com/api/v2/',
	redirectUri: 'https://account.keeberink.com/auth/loginCallback',
	jwksUri: 'https://keeberinkdev.eu.auth0.com/.well-known/jwks.json',
	issuer: 'https://keeberinkdev.eu.auth0.com/',
};

export const config = IS_PROD ? PRODUCTION_CONFIG : DEV_CONFIG;
