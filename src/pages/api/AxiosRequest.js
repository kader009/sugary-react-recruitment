import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://sugarytestapi.azurewebsites.net',
});

// Attach token to each request
// instance.interceptors.request.use((config) => {
//   const token = localStorage.getItem('accessToken');
//   if (token) {
//     config.headers['Authorization'] = `Bearer ${token}`;
//   }
//   return config;
// });

// Refresh token on 401
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');
      const accessToken = localStorage.getItem('accessToken');
      try {
        const { data } = await axios.post(
          'https://sugarytestapi.azurewebsites.net/Account/RefreshToken',
          {
            AccessToken: accessToken,
            RefreshToken: refreshToken,
          }
        );

        localStorage.setItem('accessToken', data.Token);
        localStorage.setItem('refreshToken', data.RefreshToken);
        originalRequest.headers['Authorization'] = `Bearer ${data.Token}`;
        return axios(originalRequest);
        
      } catch (error) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        console.log('token refresh failed', error);
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
