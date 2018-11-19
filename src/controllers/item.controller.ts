import { ItemService } from "./../services/item/item.service";
import { Item } from "./../services/item/item";

const itemService = new ItemService();

export const getItems = (req, res) => {
  const id = req.params.id;

  if (id !== undefined) {
    itemService.getItem(id)
      .then((item: Item) => {
        if (!item) return res.sendStatus(404);
        res.json(item);
      });
  } else {
    itemService.getItems()
      .then((items: Item[]) => res.json(items));
  }

}