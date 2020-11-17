import auth0 from 'auth0';

import { config } from 'shared/auth0/api';

const AuthenticationClient = auth0.AuthenticationClient;
const ManagementClient = auth0.ManagementClient;

export const auth0client = new AuthenticationClient({
	domain: config.domain,
	clientId: config.clientId,
	clientSecret: config.clientSecret,
	audience: config.audience,
});

export const auth0management = new ManagementClient({
	domain: config.domain,
	clientId: config.clientId,
	clientSecret: config.clientSecret,
	audience: config.audience,
});

export const mergedUserAccounts = (auth0user, user) => {
	const {
		email,
		email_verified: emailVerified,
		phone_number: phoneNumber,
		phone_verified: phoneVerified,
		multifactor,
		blocked,
	} = auth0user;
	const { _id, name, picture, settings } = user;

	return {
		_id,
		name,
		picture,
		settings,
		email,
		emailVerified,
		phoneNumber,
		phoneVerified,
		multifactor,
		blocked,
	};
};
