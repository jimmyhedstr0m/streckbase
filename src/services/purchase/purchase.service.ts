import { Purchase } from "./purchase";
import { Purchase as DBPurchase } from "../../repositories/purchase/purchase";
import { PurchaseRepository} from "./../../repositories/purchase/purchase.repository";

export class PurchaseService {
  private purchaseRepository: PurchaseRepository;
  
  constructor() {
    this.purchaseRepository = new PurchaseRepository();
  }

  private map(dbPurchase: DBPurchase): Purchase {
    if (!dbPurchase) return null;

    return {
      id: dbPurchase.id,
      date: dbPurchase.date,
      item: {
        id: dbPurchase.item_id,
        name: dbPurchase.name,
        price: dbPurchase.price,
        volume: dbPurchase.volume,
        alcohol: dbPurchase.alcohol,
        barcodes: dbPurchase.codes ? dbPurchase.codes.split(",") : []
      }
    }
  }

  getPurchases(limit: number, offset: number): Promise<Purchase[]> {
    limit = typeof limit === "number" ? limit : 20;
    offset = typeof offset === "number" ? offset : 0;

    return this.purchaseRepository.getPurchases(limit, offset)
      .then((dbPurchases: DBPurchase[]) => dbPurchases.map<Purchase>((dbPurchase: DBPurchase) => this.map(dbPurchase)));
  }
}
