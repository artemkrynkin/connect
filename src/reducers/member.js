const member = (
	state = {
		isFetching: false,
		data: null,
		error: null,
	},
	action
) => {
	switch (action.type) {
		case 'REQUEST_MEMBER':
			return {
				...state,
				isFetching: true,
			};
		case 'RECEIVE_MEMBER':
			return {
				...state,
				isFetching: false,
				data: action.payload,
			};
		default:
			return state;
	}
};

export default member;
