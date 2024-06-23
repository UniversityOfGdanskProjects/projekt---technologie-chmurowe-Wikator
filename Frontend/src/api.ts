import axios, {AxiosInstance} from 'axios';
import toast from 'react-hot-toast';
import Cookies from "js-cookie";

const api: AxiosInstance = axios.create({
  baseURL: 'http://movies-api/api'
});

api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response.status === 401) {
      Cookies.remove('access_token');
      Cookies.remove('user_role');
      Cookies.remove('user_name');
      Cookies.remove('user_id');
      toast.error(error.response.data ? error.response.data : 'You are logged off. Your session may have expired. Please log in again.');
    } else if (error.response.status === 403) {
      toast.error(error.response.data ? error.response.data : 'You are not authorized to perform this action.');

    } else if (error.response.status === 400) {
      if (error.response.data) {
        if (typeof error.response.data === 'string') {
          toast.error(error.response.data);
        } else {
          let message = 'Validation errors have occurred:'
          for (const key in error.response.data.errors) {
            message += `\n${key}: ${error.response.data.errors[key]}`;
          }
          toast.error(message);
        }
      }
    } else {
      toast.error(error.response.data ? error.response.data : 'An error occurred. Please try again later.');
    }

    return Promise.reject(error);
  }
);

export default api;
