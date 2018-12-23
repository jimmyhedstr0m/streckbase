import { BaseRepository } from "../base.repository";
import { Purchase } from "./purchase";
import { User } from "./../user/user";

export class PurchaseRepository extends BaseRepository {
  private purchaseKeys: string = "Purchases.id, Purchases.item_id,  Purchases.date, Items.name, Items.price, Items.volume, Items.alcohol";
  private userKeys: string = "Users.user_id, Users.email, Users.firstname, Users.lastname, Users.debt, Users.lobare";
  private source: string = "FROM Purchases";
  private itemsJoin: string = "INNER JOIN Items ON Items.item_id = Purchases.item_id";
  private barcodeQuery: string = `
    ( SELECT group_concat(streckbase.Barcodes.code) AS codes
      FROM streckbase.Barcodes
      WHERE streckbase.Barcodes.item_id = Purchases.item_id
      GROUP BY Barcodes.item_id
    ) AS codes`;
  private order: string = `
    ORDER BY Purchases.id
    DESC
    LIMIT ?
    OFFSET ?
  `;

  constructor() {
    super();
  }

  getUserPurchases(userId: string, limit: number, offset: number): Promise<Purchase[]> {
    return this.dbQuery(`
      SELECT ${this.purchaseKeys}, ${this.barcodeQuery}
      ${this.source}
      ${this.itemsJoin}
      WHERE Purchases.user_id = ?
      ${this.order}
    `, [userId, limit, offset]);
  }

  getPurchase(purchaseId: number): Promise<Purchase> {
    return this.dbQuery(`
      SELECT ${this.purchaseKeys}, ${this.barcodeQuery}
      ${this.source}
      ${this.itemsJoin}
      WHERE Purchases.id = ?
    `, [purchaseId])
      .then((res: any[]) => res[0]);
  }

  getLatestUserPurchase(userId: string): Promise<Purchase> {
    return this.dbQuery(`
      SELECT ${this.purchaseKeys}, ${this.barcodeQuery}
      ${this.source}
      ${this.itemsJoin}
      WHERE Purchases.user_id = ?
      ORDER BY Purchases.id
      DESC
      LIMIT 1
    `, [userId])
      .then((res: any[]) => res[0]);
  }

  getPurchases(limit: number, offset: number): Promise<Purchase[]> {
    return this.dbQuery(`
      SELECT ${this.purchaseKeys}, ${this.barcodeQuery}
      ${this.source}
      ${this.itemsJoin}
      ${this.order}
    `, [limit, offset]);
  }

  getFeedPurchases(limit: number, offset: number): Promise<Purchase[] & User[]> {
    return this.dbQuery(`
      SELECT ${this.userKeys}, ${this.purchaseKeys}, ${this.barcodeQuery}
      ${this.source}
      ${this.itemsJoin}
      INNER JOIN Users ON Users.user_id = Purchases.user_id
      ${this.order}
    `, [limit, offset]);
  }

  createPurchase(userId: string, itemId: number): Promise<any> {
    return this.dbQuery(`
      INSERT INTO Purchases (user_id, item_id, date) VALUES (?, ?, ?)
    `, [userId, itemId, new Date().toJSON()]);
  }

  deletePurchase(purchaseId: number): Promise<any> {
    return this.dbQuery(`
      DELETE FROM Purchases WHERE Purchases.id = ?
    `, [purchaseId]);
  }
}
