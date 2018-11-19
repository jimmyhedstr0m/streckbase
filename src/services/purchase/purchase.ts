import { Item } from "./../item/item";

export interface Purchase {
  id: number;
  date: Date;
  item: Item;
}
