import axios from 'axios';

export const getMyAccount = () => {
	return async dispatch => {
		dispatch({ type: 'REQUEST_USER' });

		return await axios
			.post('/api/getMyAccount')
			.then(response => {
				dispatch({
					type: 'RECEIVE_USER',
					payload: response.data,
				});

				return Promise.resolve({ status: 'success' });
			})
			.catch(error => {
				console.error(error);

				dispatch({
					type: 'ERROR_USER',
					payload: error,
				});

				return Promise.resolve({ status: 'error' });
			});
	};
};

export const editPersonalInfo = ({ data }) => {
	return async dispatch => {
		dispatch({ type: 'REQUEST_USER' });

		return await axios
			.post('/api/editPersonalInfo', data)
			.then(response => {
				dispatch({
					type: 'RECEIVE_USER',
					payload: response.data,
				});

				return Promise.resolve({ status: 'success' });
			})
			.catch(error => {
				console.error(error);

				dispatch({
					type: 'ERROR_USER',
					payload: error,
				});

				return Promise.resolve({ status: 'error' });
			});
	};
};

export const changeUserAvatar = ({ data }) => {
	return async dispatch => {
		dispatch({ type: 'REQUEST_USER' });

		return await axios
			.post('/api/changeUserAvatar', data)
			.then(response => {
				dispatch({
					type: 'RECEIVE_USER',
					payload: response.data,
				});

				return Promise.resolve({ status: 'success' });
			})
			.catch(error => {
				console.error(error);

				dispatch({
					type: 'ERROR_USER',
					payload: error,
				});

				return Promise.resolve({ status: 'error' });
			});
	};
};

export const deleteUserAvatar = () => {
	return async dispatch => {
		dispatch({ type: 'REQUEST_USER' });

		return await axios
			.get('/api/deleteUserAvatar')
			.then(response => {
				dispatch({
					type: 'RECEIVE_USER',
					payload: response.data,
				});

				return Promise.resolve({ status: 'success' });
			})
			.catch(error => {
				console.error(error);

				dispatch({
					type: 'ERROR_USER',
					payload: error,
				});

				return Promise.resolve({ status: 'error' });
			});
	};
};
