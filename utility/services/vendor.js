import { BrowserUtility } from '@utility/browser-utility';
import { APIPath, commonConstants } from '../constants/api';
import { BaseService } from './base';
import { CRUDService } from './crud';

class Vendor extends CRUDService {
  constructor() {
    super(APIPath.vendor);
  }

  getToken = () => {
    return this.getVendor()?.token
  }

  storeVendor = (user) => {
    BrowserUtility.saveObj(commonConstants.uniqueUserName,user)
  }

  getVendor = () => {
    return BrowserUtility.getObj(commonConstants.uniqueUserName);
  }

  login = (data) => {
    return BaseService.put(APIPath.vendorLogin, data)
  }

  logout = () => {
    BrowserUtility.remove(commonConstants.uniqueUserName);
  }

  isAuthenticated = () => {
    const token = this.getToken();
    return !!token;
  }

  acceptOrder = (data) => {
    return BaseService.post(APIPath.acceptOrder, data)
  }

  completeOrder = (data) => {
    return BaseService.post(APIPath.completeOrder, data)
  }

  cancelOrder = (data) => {
    return BaseService.post(APIPath.cancelOrderVendor, data)
  }

  placeBid = (data) => {
    return BaseService.post(APIPath.placeBid, data)
  }

}

const VendorService = new Vendor();
Object.freeze(VendorService);
export default VendorService;