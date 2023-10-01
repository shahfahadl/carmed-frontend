import { BrowserUtility } from '@utility/browser-utility';
import { APIPath, commonConstants } from '../constants/api';
import { BaseService } from './base';
import { CRUDService } from './crud';

class User extends CRUDService {
  constructor() {
    super(APIPath.user, true);
  }

  getToken = () => {
    return this.getUser()?.token
  }

  storeUser = (user) => {
    BrowserUtility.saveObj(commonConstants.uniqueUserName,user)
  }

  getUser = () => {
    return BrowserUtility.getObj(commonConstants.uniqueUserName);
  }

  login = (data) => {
    return BaseService.put(APIPath.userLogin, data)
  }

  logout = () => {
    BrowserUtility.removeAll();
  }

  isAuthenticated = () => {
    const token = this.getToken();
    return !!token;
  }

  order = (data) => 
    BaseService.post(APIPath.order, data)
  

  updateOrder = (data) => 
    BaseService.post(APIPath.updateOrder, data)
  

  cancelOrder = (data) => 
    BaseService.post(APIPath.cancelOrderUser, data)
  

  acceptRequest = (data) => 
    BaseService.post(APIPath.acceptRequest, data)
  

  rateVendor = (data) => 
    BaseService.post(APIPath.rateVendor, data)

  updateUser = (data) => 
    BaseService.put(APIPath.updateUser, data)

  generateOTP = (data) => 
    BaseService.post(APIPath.generateOTP, data)

  resetPassword = (data) => 
    BaseService.post(APIPath.resetPassword, data)

  getAllOrders = (data) => 
    BaseService.get(APIPath.getAllOrders, data)

  getAllUsers = (data) => 
    BaseService.get(APIPath.getAllUsers, data)

  getAllVendors = (data) => 
    BaseService.get(APIPath.getAllVendors, data)
  

}

const UserService = new User();
Object.freeze(UserService);
export default UserService;