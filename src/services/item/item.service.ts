import { Mapper } from "./../../helpers/mapper";
import { Item } from "./item";
import { Item as DBItem } from "./../../repositories/item/item";
import { ItemRepository } from "./../../repositories/item/item.repository";

export class ItemService {
  private itemRepository: ItemRepository;

  constructor() {
    this.itemRepository = new ItemRepository();
  }

  private mapItem(dbItem: DBItem): Item {
    const itemMapper: Mapper<DBItem, Item> = new Mapper(DBItem, Item);
    return itemMapper
      .createMap(dbItem)
      .forMember((dbItem) => <Partial<Item>>{
        id: dbItem.item_id,
        barcodes: dbItem.codes ? dbItem.codes.split(",") : []
      })
      .map();
  }

  getItem(id: number): Promise<Item> {
    return this.itemRepository.getItem(id)
      .then((dbItem: DBItem) => this.mapItem(dbItem));
  }

  getItems(limit: number, offset: number): Promise<Item[]> {
    return this.itemRepository.getItems(limit, offset)
      .then((dbItems: DBItem[]) => dbItems.map<Item>((dbItem: DBItem) => this.mapItem(dbItem)));
  }

  getBarcodeItem(barcode: string): Promise<Item> {
    return this.itemRepository.getBarcodeItem(barcode)
      .then((dbItem: DBItem) => this.mapItem(dbItem));
  }
}
