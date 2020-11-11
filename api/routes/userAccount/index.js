import fs from 'fs';
import { Router } from 'express';
import multer from 'multer';
import i18n from 'i18n';
import sharp from 'sharp';

import { uploadAvatar } from 'api/utils/multer-settings';
import { auth0management } from 'api/utils/auth';
import { isAuthed } from 'api/utils/permissions';
import { mergedUserAccounts } from 'api/utils/auth';

import User from 'api/models/user';

const router = Router();
const upload = uploadAvatar.single('file');
const rootFolder = process.env.NODE_ENV === 'production' ? 'build' : 'public';
const avatarDomain = process.env.NODE_ENV === 'production' ? 'https://account.keeberink.com' : 'http://localhost:3002';

router.post('/getMyAccount', isAuthed, async (req, res, next) => {
	try {
		const auth0user = await auth0management.getUser({ id: req.user.sub });
		const user = await User.findOne({ auth0uid: req.user.sub })
			.lean()
			.then(user => (!user ? throw new Error('User not found') : user));
		const userAccount = mergedUserAccounts(auth0user, user);

		res.json(userAccount);
	} catch (err) {
		next({ code: 2, err });
	}
});

router.post('/editPersonalInfo', isAuthed, async (req, res, next) => {
	const { personalInfo } = req.body;

	try {
		const auth0user = await auth0management.updateUser({ id: req.user.sub }, personalInfo);
		const user = await User.findOneAndUpdate({ auth0uid: req.user.sub }, personalInfo, {
			new: true,
			runValidators: true,
		}).lean();
		const userAccount = mergedUserAccounts(auth0user, user);

		res.json(userAccount);
	} catch (err) {
		next({ code: 2, err });
	}
});

router.post(
	'/changeUserAvatar',
	isAuthed,
	(req, res, next) => {
		upload(req, res, err => {
			if (err instanceof multer.MulterError) {
				return next({
					code: 7,
					message: err.code === 'LIMIT_FILE_SIZE' ? i18n.__('Файл слишком большой') : err.message,
				});
			}

			next();
		});
	},
	async (req, res, next) => {
		const { file } = req;

		try {
			const user = await User.findOne({ auth0uid: req.user.sub })
				.lean()
				.then(user => (!user ? throw new Error('User not found') : user));

			await sharp(file.path)
				.resize(300, 300)
				.jpeg({
					quality: 80,
				})
				.toFile(`${file.path}.jpg`)
				.then(() => {
					fs.unlink(file.path, err => {
						if (err) throw new Error(err);
					});

					if (user.picture)
						fs.unlink(rootFolder + user.picture.replace(avatarDomain, ''), err => {
							if (err) throw new Error(err);
						});
				});

			const editedValues = {
				picture: `${avatarDomain}${file.path.replace(rootFolder, '')}.jpg`,
			};

			const auth0user =
				process.env.NODE_ENV === 'production'
					? await auth0management.updateUser({ id: req.user.sub }, editedValues)
					: await auth0management.getUser({ id: req.user.sub });
			const editedUser = await User.findByIdAndUpdate(user._id, editedValues, {
				new: true,
				runValidators: true,
			}).lean();

			const userAccount = mergedUserAccounts(auth0user, editedUser);

			res.json(userAccount);
		} catch (err) {
			next({ code: 2, err });
		}
	}
);

router.get('/deleteUserAvatar', isAuthed, async (req, res, next) => {
	try {
		const auth0user = await auth0management.getUser({ id: req.user.sub });
		const user = await User.findOne({ auth0uid: req.user.sub })
			.lean()
			.then(user => (!user ? throw new Error('User not found') : user));

		await fs.unlink(rootFolder + user.picture.replace(avatarDomain, ''), err => {
			if (err) throw new Error(err);
		});

		const editedUser = await User.findByIdAndUpdate(
			user._id,
			{ picture: null },
			{
				new: true,
				runValidators: true,
			}
		).lean();
		const userAccount = mergedUserAccounts(auth0user, editedUser);

		res.json(userAccount);
	} catch (err) {
		next({ code: 2, err });
	}
});

export default router;
