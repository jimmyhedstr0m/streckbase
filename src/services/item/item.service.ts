import { Item } from "./item";
import { Item as DBItem } from "../../repositories/item/item";
import { ItemRepository } from "../../repositories/item/item.repository";

export class ItemService {
  private itemRepository: ItemRepository;
  
  constructor() {
    this.itemRepository = new ItemRepository();
  }

  private map(dbItem: DBItem): Item {
    if (!dbItem) return null;

    return {
      id: dbItem.item_id,
      name: dbItem.name,
      price: dbItem.price,
      volume: dbItem.volume,
      alcohol: dbItem.alcohol,
      barcodes: []
    }
  }

  getItem(id: number): Promise<Item> {
    return this.itemRepository.getItem(id)
      .then((dbItems: DBItem[]) => this.map(dbItems[0]));
  }

  getItems(): Promise<Item[]> {
    return this.itemRepository.getItems()
      .then((dbItems: DBItem[]) => dbItems.map<Item>((dbItem: DBItem) => this.map(dbItem)));
  }

}
