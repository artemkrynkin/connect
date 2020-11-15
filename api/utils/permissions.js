import jwt from 'express-jwt';
import jwksRsa from 'jwks-rsa';

import { checkPermissions } from 'shared/roles-access-rights';

import Member from 'api/models/member';

import { config } from 'shared/auth0/api';

export const isAuthed = jwt({
	secret: jwksRsa.expressJwtSecret({
		cache: true,
		rateLimit: true,
		jwksRequestsPerMinute: 10,
		jwksUri: config.jwksUri,
	}),
	audience: 'https://keeberink-api',
	issuer: config.issuer,
	algorithms: ['RS256'],
	getToken: req => {
		if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
			return req.headers.authorization.split(' ')[1];
		} else if (req.cookies?.['session.token']) {
			return req.cookies['session.token'];
		}

		return null;
	},
});

export const hasPermissions = async (req, res, next, accessRightList, skipCheck = false) => {
	if (!skipCheck) {
		const memberId = req.body.memberId || req.query.memberId;

		if (!memberId) {
			return next({
				code: 6,
				message: 'missing "memberId" parameter',
			});
		}

		const member = await Member.findById(memberId)
			.lean()
			.catch(err => next({ code: 2, err }));

		if (!checkPermissions(member.roles, accessRightList)) return next({ code: 4 });
	}

	next();
};
