// apiService.js

import axios from 'axios';

const apiService = axios.create({
    baseURL: 'http://localhost:5555', // Update with your backend server URL
});

export default apiService;
