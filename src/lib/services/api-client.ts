import axios from 'axios';

const apiClient = axios.create({
	baseURL: '/',
	headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.response.use(
	response => {
		return response;
	},
	error => {
		if (error.response?.data?.error) {
			error.message = error.response.data.error;

			error.apiData = error.response.data;
		} else if (error.request) {
			error.message = 'Unable to connect to the server. Please check your connection.';
		}

		return Promise.reject(error);
	},
);

export default apiClient;
