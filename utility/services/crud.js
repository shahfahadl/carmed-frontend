import { CommonUtility } from '@utility/common';
import { BaseService } from './base';
import { APIPath } from '../constants/api';

export class CRUDService {
  url = '';
  isSecure;

  constructor(url, isSecure = true) {
    this.url = url;
    this.isSecure = isSecure;
  }

  get(params) {
    const url = `${this.url}?${CommonUtility.objectToParams(params)}`;
    return BaseService.get(url, this.isSecure);
  }

  getById(id) {
    const url = `${this.url}/${id}`;
    return BaseService.get(url, this.isSecure);
  }

  add(data) {
    return BaseService.post(this.url, data, this.isSecure);
  }

  update(id, data) {
    let url = `${this.url}`;
    if (id) {
      url += `/${id}`;
    }
    return BaseService.put(url, data, this.isSecure);
  }

  remove(id) {
    const url = `${this.url}/${id}`;
    return BaseService.remove(url, this.isSecure);
  }
}