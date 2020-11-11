import { combineReducers } from 'redux';

import user from './user';
import studios from './studios';
import member from './member';
import members from './members';

import snackbars from './snackbars';

const getReducers = () => {
	return combineReducers({
		user,
		studios,
		member,
		members,

		snackbars,
	});
};

export default getReducers;
