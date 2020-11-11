import { Router } from 'express';
import mongoose from 'mongoose';

import { isAuthed, hasPermissions } from 'api/utils/permissions';

import User from 'api/models/user';
import Studio from 'api/models/studio';
import Member from 'api/models/member';

const router = Router();

// const debug = require('debug')('api:studios');

router.post('/getStudios', isAuthed, async (req, res, next) => {
	const {
		query: { name },
	} = req.body;

	try {
		const user = await User.findOne({ auth0uid: req.user.sub })
			.lean()
			.then(user => (!user ? throw new Error('User not found') : user));

		const conditions = {
			users: mongoose.Types.ObjectId(user._id),
		};

		const studiosPromise = Studio.find(conditions).lean();
		const studiosCountPromise = Studio.countDocuments(conditions);

		let studios = await studiosPromise;
		const studiosCount = await studiosCountPromise;

		if (name) {
			studios = studios.filter(studio => studio.name.toLowerCase().indexOf(name.toLowerCase()) !== -1);
		}

		res.json({
			data: studios,
			paging: {
				total: studiosCount,
			},
		});
	} catch (err) {
		next({ code: 2, err });
	}
});

router.post('/createStudio', isAuthed, async (req, res, next) => {
	const {
		data: { studio: newStudioValues },
	} = req.body;

	try {
		const user = await User.findOne({ auth0uid: req.user.sub })
			.lean()
			.then(user => (!user ? throw new Error('User not found') : user));

		const newStudio = new Studio({
			...newStudioValues,
		});
		const newMember = new Member({
			roles: ['owner'],
			confirmed: true,
			deactivated: false,
			guest: false,
		});

		user.settings.studio = newStudio._id;
		user.settings.member = newMember._id;

		newStudio.users.push(user._id);
		newStudio.members.push(newMember._id);

		newMember.user = user._id;
		newMember.studio = newStudio._id;

		const userErr = user.validateSync();
		const newStudioErr = newStudio.validateSync();
		const newMemberErr = newMember.validateSync();

		if (userErr) return next({ code: userErr.errors ? 5 : 2, err: userErr });
		if (newStudioErr) return next({ code: newStudioErr.errors ? 5 : 2, err: newStudioErr });
		if (newMemberErr) return next({ code: newMemberErr.errors ? 5 : 2, err: newMemberErr });

		await Promise.all([user.save(), newStudio.save(), newMember.save()]);

		res.json(newStudio);
	} catch (err) {
		next({ code: 2, err });
	}
});

router.post(
	'/editStudio',
	isAuthed,
	(req, res, next) => hasPermissions(req, res, next, ['studio.control']),
	async (req, res, next) => {
		const {
			studioId,
			data: { studio: studioEdited },
		} = req.body;

		try {
			const studio = await Studio.findByIdAndUpdate(studioId, { $set: studioEdited }, { new: true, runValidators: true });

			res.json(studio);
		} catch (err) {
			next({ code: err.errors ? 5 : 2, err });
		}
	}
);

export default router;
