import { BaseRepository } from "./../base.repository";
import { Item } from "./item";

export class ItemRepository extends BaseRepository {

  constructor() {
    super();
  }

  getItem(id: number): Promise<Item[]> {
    return this.dbQuery("SELECT Items.item_id, name, price, volume, alcohol, group_concat(code) AS codes FROM Items LEFT JOIN Barcodes ON Barcodes.item_id = Items.item_id WHERE Items.item_id = ? GROUP BY Items.item_id ORDER BY Items.item_id", [id]);
  }

  getItems(): Promise<Item[]> {
    return this.dbQuery("SELECT Items.item_id, name, price, volume, alcohol, group_concat(code) AS codes FROM Items LEFT JOIN Barcodes ON Barcodes.item_id = Items.item_id GROUP BY Items.item_id ORDER BY Items.item_id");
  }

}
