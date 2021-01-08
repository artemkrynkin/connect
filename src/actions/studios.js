import axios from 'axios';

export const getStudios = (
	{ query, showRequest, emptyData } = {
		query: {},
		showRequest: true,
		emptyData: false,
	}
) => {
	return async dispatch => {
		if (showRequest) dispatch({ type: 'REQUEST_STUDIOS' });
		if (emptyData) dispatch({ type: 'EMPTY_STUDIOS' });

		return await axios
			.post('/api/getStudios', {
				query,
			})
			.then(response => {
				dispatch({
					type: 'RECEIVE_STUDIOS',
					payload: response.data,
				});

				return Promise.resolve({ status: 'success' });
			})
			.catch(error => {
				console.error(error);

				dispatch({
					type: 'ERROR_STUDIOS',
					payload: error,
				});

				return Promise.reject({ status: 'error' });
			});
	};
};
