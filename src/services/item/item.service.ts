import { Mapper } from "@helpers";
import { Item } from "./item";
import { Item as DBItem } from "@repositories/item/item";
import { ItemRepository } from "@repositories/item/item.repository";
import { SystembolagetItem } from "./../systembolaget/systembolaget-item";
import { SystembolagetService } from "./../systembolaget/systembolaget.service";
import { ImageService } from "./../image/image.service";

export class ItemService {
  private itemRepository: ItemRepository;
  private systembolagetService: SystembolagetService;
  private imageService: ImageService;

  constructor() {
    this.itemRepository = new ItemRepository();
    this.systembolagetService = new SystembolagetService();
    this.imageService = new ImageService();
  }

  private mapItem(dbItem: DBItem): Item {
    if (!dbItem) return null;

    const itemMapper: Mapper<DBItem, Item> = new Mapper(DBItem, Item);
    return itemMapper
      .createMap(dbItem)
      .forMember((dbItem) => <Partial<Item>>{
        id: dbItem.item_id,
        barcodes: dbItem.codes ? dbItem.codes.split(",") : [],
        imageUrl: dbItem.image
      })
      .map();
  }

  getItem(id: number): Promise<Item> {

    return this.itemRepository.getItem(id)
      .then((dbItem: DBItem) => {
        // if (dbItem.systembolaget_id && !dbItem.image) {
        //   this.systembolagetService.searchItem(dbItem.systembolaget_id)
        //     .then((res: SystembolagetItem) => this.imageService.storeImage(res.imageUrl, dbItem.item_id))
        //     .then((imagePath: string) => {
        //       const item: Item = this.mapItem(dbItem);
        //       item.imageUrl = imagePath;

        //       return item;
        //     })
        //     .catch((err: any) => console.log("Some error with when trying to get the image", err));
        // }

        return this.mapItem(dbItem);
      });
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
