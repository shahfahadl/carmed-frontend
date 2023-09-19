import { APIPath } from '../constants/api';
import { CRUDService } from './crud';

class Bidding extends CRUDService {
  constructor() {
    super(APIPath.bidding)
  }
}

const BiddingService = new Bidding();
Object.freeze(BiddingService);
export default BiddingService;