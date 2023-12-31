import axios from 'axios';
import {BASE_URL} from '../constants/base_url';
import {store} from '../store';
import * as authActions from '../store/actions/auth';

axios.defaults.baseURL = BASE_URL;

const authRoutes = ['user/login'];

axios.interceptors.request.use(
  function (config) {
    if (config.method === 'POST' || config.method === 'post') {
      config.headers['Content-Type'] = 'multipart/form-data';
    }

    if (!authRoutes.find(route => route === config.url)) {
      const {
        auth: {tokenType, accessToken},
      } = store.getState().auth;

      if (tokenType && accessToken) {
        config.headers.Authorization = `${tokenType} ${accessToken}`;
      }
    }

    console.log(config.url);
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    const {status} = error.response;
    if (status === 401) {
      store.dispatch(authActions.logout());
    }
    console.log(error)

    throw new Error(error.message);
  },
);
