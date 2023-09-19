import { APIPath } from '../constants/api';
import { BaseService } from './base';
import { CRUDService } from './crud';

class UploadMedia extends CRUDService {
  constructor() {
    super(APIPath.aws)
  }

  getSignedUrl(data){
    return BaseService.put(APIPath.getSignedUrl, data);
  }
}

const UploadMediaService = new UploadMedia();
Object.freeze(UploadMediaService);
export default UploadMediaService;