import request from "request";

import { toCamel } from "../../helpers/utils";
import { SystembolagetItem } from "./systembolaget-item";

export class SystembolagetService {
  private url: string = "https://systembolaget.se/api/productsearch/search/sok-dryck/?searchquery=";

  constructor() { }

  private extractProductData(data: any, query: string): SystembolagetItem {
    if (data && data.productSearchResults) {

      for (const product of data.productSearchResults) {
        if (product.productNumber.indexOf(query) > -1) {
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

  searchItem(query: string): Promise<SystembolagetItem> {
    return new Promise((resolve, reject) => {
      request(this.url + query, (error, response, body) => {
        if (error) return reject(error);

        try {
          const data = toCamel(JSON.parse(body));
          resolve(this.extractProductData(data, query));
        } catch (e) {
          reject(e);
        }
      });
    });
  }
}
