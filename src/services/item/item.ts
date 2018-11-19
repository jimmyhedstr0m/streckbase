export interface Item {
  id: number;
  name: string;
  price: number;
  volume?: number;
  alcohol?: number;
  barcodes: string[];
}
