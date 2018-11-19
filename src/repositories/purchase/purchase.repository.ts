import { BaseRepository } from "../base.repository";
import { Purchase } from "./purchase";

export class PurchaseRepository extends BaseRepository {

  constructor() {
    super();
  }

  getPurchases(userId: string, limit: number, offset: number): Promise<Purchase[]> {
    return this.dbQuery(`
      SELECT Purchases.id, Purchases.item_id, Items.name, Items.price, Items.volume, Items.alcohol, Purchases.date, (
        SELECT group_concat(streckbase.Barcodes.code) AS codes
        FROM streckbase.Barcodes
        WHERE streckbase.Barcodes.item_id = Purchases.item_id
        GROUP BY Barcodes.item_id
      ) AS codes
      FROM Purchases
      INNER JOIN Items ON Items.item_id = Purchases.item_id
      WHERE Purchases.user_id = ?
      ORDER BY Purchases.id
      DESC
      LIMIT ?
      OFFSET ?
    `, [userId, limit, offset]);
  }

}
