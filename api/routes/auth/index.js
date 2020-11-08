import { Router } from 'express';
import { URL } from 'url';

import { config } from 'shared/auth0/api';

import { auth0client, auth0management } from 'api/utils/auth';

import User from 'api/models/user';
const IS_PROD = process.env.NODE_ENV === 'production';
const FALLBACK_URL = IS_PROD ? 'https://account.keeberink.com' : 'http://localhost:3002';

const router = Router();

router.post('/checkUsername', async (req, res, next) => {
	const { email } = req.body;

	return auth0management
		.getUsersByEmail(email)
		.then(users => {
			if (users.length) return res.json({ action: 'noAction' });
			else return res.json({ action: 'signup' });
		})
		.catch(err => next({ code: 2, err }));
});

router.post('/signup', async (req, res, next) => {
	const { email, name, password } = req.body;

	let auth0userError;
	const auth0user = await auth0client.database
		.signUp({
			email,
			name,
			password,
			connection: 'Username-Password-Authentication',
		})
		.catch(err => {
			auth0userError = JSON.parse(err.originalError.response.text);
		});

	if (auth0userError) {
		if (auth0userError?.code === 'invalid_signup') {
			return auth0management
				.getUsersByEmail(email)
				.then(users => {
					if (users.length) return res.json({ action: 'login', infoCode: 'existingUser' });
					else return next({ code: 2, auth0userError });
				})
				.catch(err => next({ code: 2, err }));
		} else {
			return next({ code: 2, err: auth0userError });
		}
	}

	const newUser = new User({
		auth0uid: `auth0|${auth0user._id}`,
		name: auth0user.name,
	});

	const newUserErr = newUser.validateSync();

	if (newUserErr) return next({ code: newUserErr.errors ? 5 : 2, err: newUserErr });

	await newUser.save();

	res.json();
});

router.get('/loginCallback', async (req, res) => {
	const { returnTo, code, error, error_description } = req.query;
	const resetLogin = (path, description) => {
		res.clearCookie('session.token');

		redirectUrl = new URL(`${FALLBACK_URL}${path}`);

		redirectUrl.searchParams.append('snackbarMessage', description);
		redirectUrl.searchParams.append('snackbarType', 'error');
	};

	let redirectUrl = new URL(returnTo || FALLBACK_URL);

	if (!error) {
		await auth0client.oauth
			.authorizationCodeGrant({
				code,
				redirect_uri: config.redirectUri,
			})
			.then(({ access_token, id_token, scope, expires_in, token_type }) => {
				res.cookie('session.token', access_token, {
					maxAge: expires_in * 1000,
					httpOnly: true,
					domain: IS_PROD ? '.keeberink.com' : '',
					secure: IS_PROD,
				});
			})
			.catch(err => {
				const error = JSON.parse(err.message);

				resetLogin('/login', error.error_description);
			});
	} else {
		resetLogin('/login', error_description);
	}

	return res.redirect(redirectUrl.href);
});

router.get('/logout', async (req, res) => {
	const { returnTo } = req.query;

	let redirectUrl = new URL(`https://${config.domain}/v2/logout`);

	redirectUrl.searchParams.append('client_id', config.clientId);
	redirectUrl.searchParams.append('returnTo', returnTo || FALLBACK_URL);

	res.clearCookie('session.token');

	return res.redirect(redirectUrl.href);
});

router.post('/resetPassword', (req, res, next) => {
	const { email } = req.body;

	auth0client
		.requestChangePasswordEmail({
			email,
			connection: config.dbConnectionName,
			client_id: config.clientId,
		})
		.then(() => res.json())
		.catch(err => next({ code: 2, err }));
});

export default router;
