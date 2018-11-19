import { Item } from "./item";
import { Item as DBItem } from "./../../repositories/item/item";
import { ItemRepository } from "./../../repositories/item/item.repository";

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
      barcodes: dbItem.codes ? dbItem.codes.split(",") : []
    }
  }

  getItem(id: number): Promise<Item> {
    return this.itemRepository.getItem(id)
      .then((dbItem: DBItem) => this.map(dbItem));
  }

  getItems(limit: number, offset: number): Promise<Item[]> {
    limit = typeof limit === "number" ? limit : 20;
    offset = typeof offset === "number" ? offset : 0;

    return this.itemRepository.getItems(limit, offset)
      .then((dbItems: DBItem[]) => dbItems.map<Item>((dbItem: DBItem) => this.map(dbItem)));
  }

  getBarcodeItem(barcode: string): Promise<Item> {
    return this.itemRepository.getBarcodeItem(barcode)
      .then((dbItem: DBItem) => this.map(dbItem));
  }
}
