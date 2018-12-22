import { BaseRepository } from "./../base.repository";
import { Item } from "./item";

export class ItemRepository extends BaseRepository {
  private itemKeys: string = "Items.item_id, name, price, volume, alcohol, group_concat(code) AS codes, systembolaget_id, Images.thumbnail, Images.large AS image";
  private itemSource: string = "FROM Items";
  private barcodeJoin: string = "LEFT JOIN Barcodes ON Barcodes.item_id = Items.item_id";
  private imageJoin: string = "LEFT JOIN Images ON Images.item_id = Items.item_id";

  constructor() {
    super();
  }

  getItem(id: number): Promise<Item> {
    if (!id && id !== 0) return null;

    return this.dbQuery(`
      SELECT ${this.itemKeys}
      ${this.itemSource}
      ${this.barcodeJoin}
      ${this.imageJoin}
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
      SELECT ${this.itemKeys}
      ${this.itemSource}
      ${this.barcodeJoin}
      ${this.imageJoin}
      GROUP BY Items.item_id
      ORDER BY Items.item_id
      LIMIT ?
      OFFSET ?
    `, [limit, offset]);
  }

}
