import { BaseRepository } from "./../base.repository";
import { Item } from "./item";
import { Item as APIItem } from "@services/item/item";

export class ItemRepository extends BaseRepository {
  constructor() {
    super();
  }

  getItem(id: number): Promise<Item> {
    if (!id && id !== 0) return null;

    return this.dbQuery(`
      SELECT Items.item_id, name, price, volume, alcohol, group_concat(code) AS codes, systembolaget_id, Images.thumbnail, Images.large AS image
      FROM Items
      LEFT JOIN Barcodes ON Barcodes.item_id = Items.item_id
      LEFT JOIN Images ON Images.item_id = Items.item_id
      WHERE Items.item_id = ?
      GROUP BY Items.item_id
      ORDER BY Items.item_id
    `, [id])
      .then((res: any[]) => res[0]);
  }

  getBarcodeItem(barcode: string): Promise<Item> {
    barcode = `%${barcode}%`;
    return this.dbQuery("SELECT item_id AS id FROM Barcodes WHERE code LIKE ?", [barcode])
      .then((res: any[]) => res[0] && res[0].id ? res[0].id : null)
      .then((id: number) => this.getItem(id));
  }

  getItems(limit: number, offset: number): Promise<Item[]> {
    return this.dbQuery(`
      SELECT Items.item_id, name, price, volume, alcohol, group_concat(code) AS codes, systembolaget_id, Images.thumbnail, Images.large AS image
      FROM Items
      LEFT JOIN Barcodes ON Barcodes.item_id = Items.item_id
      LEFT JOIN Images ON Images.item_id = Items.item_id
      GROUP BY Items.item_id
      ORDER BY Items.item_id
      LIMIT ?
      OFFSET ?
    `, [limit, offset]);
  }

  updateItem(item: APIItem): Promise<any> {
    return this.dbQuery(`
      UPDATE Items i, Barcodes b
      SET i.name = ?, i.price = ?, i.volume = ?, i.alcohol = ?, b.code = ?
      WHERE i.item_id = b.item_id AND i.item_id = ?
    `, [item.name, item.price, item.volume, item.alcohol, item.barcodes.join(), item.id]);
  }

}
