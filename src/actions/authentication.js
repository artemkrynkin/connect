import axios from 'axios';
import queryString from 'query-string';

import { config } from 'shared/auth0/web';

import { webAuth } from 'src/api/auth';
import { SERVER_URL } from 'src/api/constants';

export const checkUsername = ({ data: { email } }) => {
	return async () => {
		return await axios
			.post('/auth/checkUsername', {
				email,
			})
			.then(response => {
				return Promise.resolve({ status: 'success', data: response.data });
			})
			.catch(error => {
				console.error(error.response);

				return Promise.resolve({ status: 'error', data: error.response.data });
			});
	};
};

export const signup = ({ data }) => {
	return async () => {
		return await axios
			.post('/auth/signup', data)
			.then(response => {
				return Promise.resolve({ status: 'success', data: response.data });
			})
			.catch(error => {
				console.error(error.response);

				return Promise.resolve({ status: 'error', data: error.response.data });
			});
	};
};

export const login = ({ data: { email, password, returnTo } }) => {
	return async () => {
		let redirectUri = config.redirectUri;

		if (returnTo) redirectUri += `?${queryString.stringify({ returnTo })}`;

		const loginResponse = await new Promise(resolve => {
			webAuth.login(
				{
					username: email,
					password,
					realm: config.dbConnectionName,
					redirectUri,
				},
				error => {
					if (error) resolve(error);
				}
			);
		});

		return Promise.resolve({ status: 'error', data: loginResponse?.original });
	};
};

export const resetPassword = ({ data }) => {
	return async () => {
		return await axios
			.post('/auth/resetPassword', data)
			.then(() => {
				return Promise.resolve({ status: 'success' });
			})
			.catch(error => {
				console.log(1);
				console.error(error.response);

				return Promise.resolve({ status: 'error', data: error.response.data });
			});
	};
};

export const logout = () => (window.location.href = `${SERVER_URL}/auth/logout`);
