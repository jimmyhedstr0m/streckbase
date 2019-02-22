import { Mapper, subset } from "@helpers";
import { PurchaseRepository } from "@repositories/purchase/purchase.repository";
import { Purchase } from "@services/purchase/purchase";
import { Purchase as DBPurchase } from "@repositories/purchase/purchase";
import { Item } from "@services/item/item";
import { Item as DBItem } from "@repositories/item/item";

export class PurchaseService {
  private purchaseRepository: PurchaseRepository;

  constructor() {
    this.purchaseRepository = new PurchaseRepository();
  }

  private mapPurchase(dbPurchase: DBPurchase): Purchase {
    const purchaseMapper: Mapper<DBPurchase, Purchase> = new Mapper(DBPurchase, Purchase);
    const itemMapper: Mapper<DBItem, Item> = new Mapper(DBItem, Item);

    return purchaseMapper
      .createMap(dbPurchase)
      .forMember((dbPurchase: DBPurchase) => {
        const item: Item = itemMapper
          .createMap(<DBItem>subset(DBItem, dbPurchase))
          .forMember((dbItem: DBItem) => <Partial<Item>>{
            id: dbItem.item_id,
            barcodes: dbItem.codes ? dbItem.codes.split(",") : []
          })
          .map();

        const purchase: Partial<Purchase> = {
          item,
          totalCount: dbPurchase.total
        };

        return purchase;
      })
      .map();
  }

  getPurchase(purchaseId: number): Promise<Purchase> {
    return this.purchaseRepository.getPurchase(purchaseId)
      .then((dbPurchase: DBPurchase) => this.mapPurchase(dbPurchase));
  }

  getPurchases(limit: number, offset: number): Promise<Purchase[]> {
    return this.purchaseRepository.getPurchases(limit, offset)
      .then((dbPurchases: DBPurchase[]) => dbPurchases.map<Purchase>((dbPurchase: DBPurchase) => this.mapPurchase(dbPurchase)));
  }

}
