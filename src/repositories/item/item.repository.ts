import { BaseRepository } from "../base.repository";
import { Item } from "./item";

export class ItemRepository extends BaseRepository {

  constructor() {
    super();
  }

  getItem(id: number): Promise<Item[]> {
    return this.dbQuery("SELECT * FROM Items WHERE item_id=?", [id]);
  }

  getItems(): Promise<Item[]> {
    return this.dbQuery("SELECT * FROM Items");
  }

}
