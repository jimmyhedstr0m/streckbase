import request from "request";

import { SystembolagetService } from "./../services/systembolaget/systembolaget.service";
import { SystembolagetItem } from "./../services/systembolaget/systembolaget-item";

const systembolagetService = new SystembolagetService();

export const searchItem = (req, res) => {
  const article: number = req.query.q;
  if (!article) return res.sendStatus(400);

  systembolagetService.searchItem(article)
    .then((item: SystembolagetItem) => res.send(item));
}

export const getImage = (req, res) => {
  const url: string = req.query.url;
  if (!url) return res.sendStatus(400);

  request.get(url).pipe(res);
}