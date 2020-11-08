import { combineReducers } from 'redux';

import user from './user';
import studio from './studio';
import studios from './studios';
import member from './member';
import members from './members';

import snackbars from './snackbars';

const getReducers = () => {
	return combineReducers({
		user,
		studio,
		studios,
		member,
		members,

		snackbars,
	});
};

export default getReducers;
