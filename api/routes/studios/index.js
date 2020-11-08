import { Router } from 'express';
import mongoose from 'mongoose';
// import i18n from 'i18n';

import { isAuthed } from 'api/utils/permissions';

import User from 'api/models/user';
import Studio from 'api/models/studio';

const studiosRouter = Router();

// const debug = require('debug')('api:studios');

studiosRouter.post('/getStudios', isAuthed, async (req, res, next) => {
	const user = await User.findOne({ auth0uid: req.user.sub })
		.lean()
		.catch(err => next({ code: 2, err }));

	const studios = await Studio.find({ users: mongoose.Types.ObjectId(user._id) }).catch(err => next({ code: 2, err }));

	res.json(studios);
});

export default studiosRouter;
