import { Item } from "./../item/item";

export interface UserPurchase {
  id: number;
  date: Date;
  item: Item;
}

export interface User {
  id: string;
  email?: string;
  firstname: string;
  lastname: string;
  debt: number;
  purchases?: UserPurchase[];
}
