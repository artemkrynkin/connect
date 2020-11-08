import axios from 'axios';

export const getStudios = () => {
	return async dispatch => {
		dispatch({ type: 'REQUEST_STUDIOS' });

		return await axios
			.post('/api/getStudios')
			.then(response => {
				dispatch({
					type: 'RECEIVE_STUDIOS',
					payload: response.data,
				});
			})
			.catch(error => {
				console.error(error.response);

				return Promise.resolve({ status: 'error' });
			});
	};
};
