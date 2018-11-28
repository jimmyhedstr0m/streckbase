import { ItemService } from "./../services/item/item.service";
import { Item } from "./../services/item/item";

const itemService = new ItemService();

export const getItems = (req, res) => {
  const id: number = req.params.id;

  if (id !== undefined) {
    itemService.getItem(id)
      .then((item: Item) => {
        if (!item) return res.sendStatus(404);
        res.json(item);
      });
  } else {
    const offset = parseInt(req.query.offset, 10) || 0;
    const limit = parseInt(req.query.limit, 10) || 20;

    itemService.getItems(limit, offset)
      .then((items: Item[]) => res.json(items));
  }
}

export const getBarcodeItem = (req, res) => {
  const barcode: string = req.params.barcode;
  if (!barcode) return res.sendStatus(404);

  itemService.getBarcodeItem(barcode)
    .then((item: Item) => res.json(item));
}