import request from "request";

import { toCamel } from "../../helpers/utils";
import { SystembolagetItem } from "./systembolaget-item";

export class SystembolagetService {
  private url: string = "https://systembolaget.se/api/productsearch/search/sok-dryck/?searchquery=";

  constructor() { }

  private extractProductData(data: any, article: number): SystembolagetItem {
    if (data && data.productSearchResults) {

      for (const product of data.productSearchResults) {
        if (product.productNumber.indexOf(article) > -1) {
          const item: SystembolagetItem = {
            name: product.productNameThin ? product.productNameBold + ", " + product.productNameThin : product.productNameBold,
            producer: product.producerName,
            price: product.price,
            imageUrl: product.productImage && product.productImage.imageUrl ? "https:" + product.productImage.imageUrl : null,
            volume: product.volume ? product.volume / 10 : null // convert milliliter to centiliter
          };

          return item;
        }
      }
    }

    return null;
  }

  // search with product id from systembolaget
  searchItem(article: number): Promise<SystembolagetItem> {
    return new Promise((resolve, reject) => {
      request(this.url + article, (error, response, body) => {
        if (error) return reject(error);

        try {
          const data = toCamel(JSON.parse(body));
          resolve(this.extractProductData(data, article));
        } catch (e) {
          reject(e);
        }
      });
    });
  }
}
