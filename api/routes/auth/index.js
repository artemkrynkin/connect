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

	try {
		const auth0users = await auth0management.getUsersByEmail(email);

		res.json({
			action: auth0users.length ? 'noAction' : 'signup',
		});
	} catch (err) {
		next({ code: 2, err });
	}
});

router.post('/signup', async (req, res, next) => {
	const { email, name, password } = req.body;

	try {
		const auth0user = await auth0client.database
			.signUp({
				email,
				name,
				password,
				connection: 'Username-Password-Authentication',
			})
			.catch(err => throw new Error(err.message));

		const newUser = new User({
			auth0uid: `auth0|${auth0user._id}`,
			name: auth0user.name,
		});

		const newUserErr = newUser.validateSync();

		if (newUserErr) return next({ code: newUserErr.errors ? 5 : 2, err: newUserErr });

		await newUser.save();

		res.json();
	} catch (err) {
		const error = JSON.parse(err.message);

		if (error?.code === 'invalid_signup') {
			const auth0users = await auth0management.getUsersByEmail(email);

			if (auth0users.length) res.json({ action: 'login', infoCode: 'existingUser' });
			else next({ code: 2, err });
		} else {
			next({ code: 2, err });
		}
	}
});

router.get('/loginCallback', async (req, res) => {
	const { returnTo, code, error } = req.query;

	let redirectUrl = new URL(returnTo || FALLBACK_URL);

	try {
		if (error) throw new Error(JSON.stringify(req.query));

		const { access_token, expires_in } = await auth0client.oauth
			.authorizationCodeGrant({
				code: code,
				redirect_uri: config.redirectUri,
			})
			.catch(err => throw new Error(err.message));

		res.cookie('session.token', access_token, {
			maxAge: expires_in * 1000,
			httpOnly: true,
			domain: IS_PROD ? '.keeberink.com' : '',
			secure: IS_PROD,
		});
	} catch (err) {
		const error = JSON.parse(err.message);

		if (typeof error === 'object') {
			res.clearCookie('session.token');

			redirectUrl = new URL(`${FALLBACK_URL}/login`);

			redirectUrl.searchParams.set('snackbarMessage', error?.error_description);
			redirectUrl.searchParams.set('snackbarType', 'error');
		}
	}

	res.redirect(redirectUrl.href);
});

router.get('/logout', async (req, res) => {
	const { returnTo } = req.query;

	let redirectUrl = new URL(`https://${config.domain}/v2/logout`);

	redirectUrl.searchParams.set('client_id', config.clientId);
	redirectUrl.searchParams.set('returnTo', returnTo || FALLBACK_URL);

	res.clearCookie('session.token', {
		domain: IS_PROD ? '.keeberink.com' : '',
	});

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

router.post('/getAccessToken', async (req, res, next) => {
	const { code, codeVerifier, redirectUri } = req.body;

	try {
		const { id_token, ...remainingParams } = await auth0client.oauth
			.authorizationCodeGrant({
				code: code,
				code_verifier: codeVerifier,
				redirect_uri: redirectUri,
			})
			.catch(err => throw new Error(err.message));

		res.json({
			...remainingParams,
			id_token: null,
		});
	} catch (err) {
		next({ code: 2, err });
	}
});

export default router;
