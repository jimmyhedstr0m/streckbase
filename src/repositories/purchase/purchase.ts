export interface Purchase {
  id: number;
  date: Date;
  item_id: number;
  name: string;
  price: number;
  volume?: number;
  alcohol?: number;
  codes: string;
}
