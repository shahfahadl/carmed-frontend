import { BrowserUtility } from '@utility/browser-utility';
import { commonConstants } from '@utility/constants/api';
import axios from 'axios';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

const server = publicRuntimeConfig.apiPath;
const baseURL = server;

const onSuccess = (response) => response.data

const onError = async (error) => {
  if (error.response) {
    if (error.response.status === 403) {
      window.localStorage.clear();
      window.location.href = '/login';
      return Promise.reject(error);
    }
    console.log('err: ', error)
    if (error.response.status === 405) {
      window.localStorage.clear();
      window.location.href = '/blocked';
      return Promise.reject(error);
    }
  }

  return Promise.reject({
    code: error?.response?.data?.code || error?.response?.code || '',
    error: error?.response?.data?.error || error?.response?.data || '',
    status: error?.response?.status || '',
  });
}

const request = async (options, isSecure = true) => {
  const headers = {};

  if (isSecure) {
    const user = BrowserUtility.getObj(commonConstants.uniqueUserName);
    headers.authorization = user?.token;
    headers.type = user?.type;
  }

  const client = axios.create({
    baseURL: baseURL,
    headers: { ...headers }
  });

  return client(options)
    .then(onSuccess)
    .catch(onError);
}

export class BaseService {
  static get = (url, isSecure = true) => request({
    url,
    method: 'GET',
  }, isSecure)

  static post = (url, data, isSecure = true) => request({
    url,
    method: 'POST',
    data,
  }, isSecure)

  static put = (url, data, isSecure = true) => request({
    url,
    method: 'PUT',
    data,
  }, isSecure)

  static remove = (url, isSecure = true) => request({
    url,
    method: 'DELETE',
  }, isSecure)
}