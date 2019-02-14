import { BaseRepository } from "../base.repository";
import { Purchase } from "./purchase";
import { User } from "./../user/user";

export class PurchaseRepository extends BaseRepository {

  constructor() {
    super();
  }

  getUserPurchases(userId: string, limit: number, offset: number): Promise<Purchase[]> {
    return this.dbQuery(`
      SELECT p1.id, p1.item_id, p1.date, i.name, i.price, i.volume, i.alcohol,
      (
        SELECT group_concat(Barcodes.code) AS codes
        FROM Barcodes
        WHERE Barcodes.item_id = p1.item_id
        GROUP BY Barcodes.item_id
      ) AS codes,
      (
        SELECT COUNT(p2.item_id)
        FROM Purchases p2
        WHERE p2.item_id = p1.item_id AND p2.user_id = p1.user_id AND p2.id <= p1.id
        GROUP BY p2.item_id
      ) AS total
      FROM Purchases p1
      INNER JOIN Items i ON i.item_id = p1.item_id
      WHERE p1.user_id = ?
      ORDER BY p1.id
      DESC
      LIMIT ?
      OFFSET ?
    `, [userId, limit, offset]);
  }

  getPurchase(purchaseId: number): Promise<Purchase> {
    return this.dbQuery(`
      SELECT p1.id, p1.item_id, p1.date, i.name, i.price, i.volume, i.alcohol,
      (
        SELECT group_concat(Barcodes.code) AS codes
        FROM Barcodes
        WHERE Barcodes.item_id = p1.item_id
        GROUP BY Barcodes.item_id
      ) AS codes
      FROM Purchases p1
      JOIN Items i ON i.item_id = p1.item_id
      WHERE p1.id = ?
    `, [purchaseId])
      .then((res: any[]) => res[0]);
  }

  getLatestUserPurchase(userId: string): Promise<Purchase> {
    return this.dbQuery(`
      SELECT u.user_id, u.email, u.firstname, u.lastname, u.debt, u.lobare, u.admin, p1.id, p1.item_id, p1.date, i.name, i.price, i.volume, i.alcohol,
      (
        SELECT group_concat(b.code) AS codes
        FROM Barcodes b
        WHERE b.item_id = p1.item_id
        GROUP BY b.item_id
      ) AS codes,
      (
        SELECT COUNT(p2.item_id)
        FROM Purchases p2
        WHERE p2.item_id = p1.item_id AND p2.user_id = u.user_id AND p2.id <= p1.id
      ) AS total
      FROM Purchases p1
      JOIN Items i ON i.item_id = p1.item_id
      JOIN Users u ON u.user_id = p1.user_id
      WHERE u.user_id = ?
      ORDER BY p1.id
      DESC
      LIMIT 1
    `, [userId])
      .then((res: any[]) => res[0]);
  }

  getPurchases(limit: number, offset: number): Promise<Purchase[]> {
    return this.dbQuery(`
      SELECT p1.id, p1.item_id, p1.date, i.name, i.price, i.volume, i.alcohol,
      (
        SELECT group_concat(Barcodes.code) AS codes
        FROM Barcodes
        WHERE Barcodes.item_id = p1.item_id
        GROUP BY Barcodes.item_id
      ) AS codes
      FROM Purchases p1
      JOIN Items i ON i.item_id = p1.item_id
      ORDER BY p1.id
      DESC
      LIMIT ?
      OFFSET ?
    `, [limit, offset]);
  }

  getFeedPurchases(limit: number, offset: number): Promise<Purchase[] & User[]> {
    return this.dbQuery(`
      SELECT u.user_id, u.email, u.firstname, u.lastname, u.debt, u.lobare, u.admin, p1.id, p1.item_id, p1.date, i.name, i.price, i.volume, i.alcohol,
      (
        SELECT group_concat(b.code) AS codes
        FROM Barcodes b
        WHERE b.item_id = p1.item_id
        GROUP BY b.item_id
      ) AS codes,
      (
        SELECT COUNT(p2.item_id)
        FROM Purchases p2
        WHERE p2.item_id = p1.item_id AND p2.user_id = u.user_id AND p2.id <= p1.id
      ) AS total
      FROM Purchases p1
      JOIN Items i ON i.item_id = p1.item_id
      JOIN Users u ON u.user_id = p1.user_id
      ORDER BY p1.id
      DESC
      LIMIT ?
      OFFSET ?
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
