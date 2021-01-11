import { Router } from 'express';
import mongoose from 'mongoose';

import { isAuthed, hasPermissions } from 'api/utils/permissions';

import { memberRoleTransform } from 'shared/roles-access-rights';

import User from 'api/models/user';
import Studio from 'api/models/studio';
import Member from 'api/models/member';

const router = Router();

// const debug = require('debug')('api:products');

router.post(
	'/getMembers',
	isAuthed,
	(req, res, next) => hasPermissions(req, res, next, ['products.control']),
	async (req, res, next) => {
		const {
			studioId,
			query: { name, role },
		} = req.body;

		try {
			const conditions = {
				studio: studioId,
				confirmed: true,
			};

			if (role && !/all|owners|admins|artists/.test(role)) conditions._id = mongoose.Types.ObjectId(role);

			const membersPromise = Member.find(conditions)
				.lean()
				.populate('user', 'picture name email');
			const membersRegularCountPromise = Member.countDocuments({ ...conditions, guest: false });
			const membersGuestsCountPromise = Member.countDocuments({ ...conditions, guest: true });

			let members = await membersPromise;
			const membersRegularCount = await membersRegularCountPromise;
			const membersGuestsCount = await membersGuestsCountPromise;

			members = members
				.map(member => ({
					...member,
					roleBitMask: memberRoleTransform(member.roles, true),
				}))
				.sort((memberA, memberB) => +memberB.roleBitMask - +memberA.roleBitMask || memberA.user.name.localeCompare(memberB.user.name));

			if (role && /owners|admins|artists/.test(role)) {
				const roleFilter = role.slice(0, -1);

				members = members.filter(member => member.roles.some(role => role.includes(roleFilter)));
			}

			if (name) {
				members = members.filter(member => member.user.name.toLowerCase().indexOf(name.toLowerCase()) !== -1);
			}

			res.json({
				data: members,
				paging: {
					totalRegular: membersRegularCount,
					totalGuests: membersGuestsCount,
				},
			});
		} catch (err) {
			next({ code: 2, err });
		}
	}
);

router.post(
	'/getMember',
	isAuthed,
	(req, res, next) => hasPermissions(req, res, next, ['products.control']),
	async (req, res, next) => {
		const {
			params: { memberId },
		} = req.body;

		try {
			const member = await Member.findById(memberId).populate('user', 'picture name email');

			res.json(member);
		} catch (err) {
			next({ code: 2, err });
		}
	}
);

router.post(
	'/memberInvitationByQr',
	isAuthed,
	(req, res, next) => hasPermissions(req, res, next, ['studio.control']),
	async (req, res, next) => {
		const { studioId } = req.body;

		try {
			const newMember = new Member({
				studio: studioId,
			});

			const newMemberErr = newMember.validateSync();

			if (newMemberErr) return next({ code: newMemberErr.errors ? 5 : 2, err: newMemberErr });

			await Promise.all(newMember.save(), Studio.findByIdAndUpdate(studioId, { $push: { members: newMember } }));

			res.json(newMember);
		} catch (err) {
			next({ code: 2, err });
		}
	}
);

router.post('/linkUserAndStudio', isAuthed, async (req, res, next) => {
	const {
		data: { studioId },
	} = req.body;

	try {
		const user = await User.findOne({ auth0uid: req.user.sub }).then(user => (!user ? throw new Error('User not found') : user));

		const newMember = new Member({
			user: user._id,
			studio: studioId,
			roles: ['artist'],
			confirmed: true,
			deactivated: false,
			lastBillingDate: Date.now(),
			nextBillingDate: Date.now(),
		});

		if (!user.settings.studio && !user.settings.member) {
			user.settings.studio = studioId;
			user.settings.member = newMember._id;
		}

		const userErr = user.validateSync();
		const newMemberErr = newMember.validateSync();

		if (userErr) return next({ code: userErr.errors ? 5 : 2, err: userErr });
		if (newMemberErr) return next({ code: newMemberErr.errors ? 5 : 2, err: newMemberErr });

		await Promise.all([
			newMember.save(),
			user.save(),
			Studio.findByIdAndUpdate(studioId, { $push: { members: newMember._id, users: user._id } }),
		]);

		res.json();
	} catch (err) {
		next({ code: 2, err });
	}
});

router.post(
	'/editMember',
	isAuthed,
	(req, res, next) => hasPermissions(req, res, next, ['studio.control']),
	async (req, res, next) => {
		const {
			params: { memberId },
			data: { member: memberValues },
		} = req.body;

		try {
			if (/owner|admin/.test(memberValues.roles) && !/artist/.test(memberValues.roles)) {
				memberValues.purchaseExpenseStudio = true;
				memberValues.markupPosition = false;
			}

			const member = await Member.findByIdAndUpdate(memberId, { $set: memberValues }, { new: true, runValidators: true }).populate(
				'user',
				'picture name email'
			);

			res.json(member);
		} catch (err) {
			next({ code: 2, err });
		}
	}
);

router.post(
	'/deactivatedMember',
	isAuthed,
	(req, res, next) => hasPermissions(req, res, next, ['studio.control']),
	async (req, res, next) => {
		const {
			params: { memberId },
		} = req.body;

		try {
			const member = await Member.findByIdAndUpdate(memberId, { $set: { deactivated: true } }, { new: true, runValidators: true }).populate(
				'user',
				'picture name email'
			);

			res.json(member);
		} catch (err) {
			next({ code: 2, err });
		}
	}
);

export default router;
