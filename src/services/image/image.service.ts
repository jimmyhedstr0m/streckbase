import { createWriteStream, mkdir } from "fs";
import request from "request";

export class ImageService {
  private path: string = "public";

  constructor() {
    mkdir(this.path, () => { });
    mkdir(`${this.path}/images`, () => { });
    // mkdir(`${this.path}/thumbnails`, () => { });
  }

  private downloadImage(url: string, filename: string): Promise<any> {
    return new Promise((resolve, reject) => {
      request.head(url, (err) => {
        if (err) return reject(err);

        request(url)
          .pipe(
            createWriteStream(this.path + "/images/" + filename)
          )
          .on("close", () => resolve());
      });
    });
  };

  storeImage(imageUrl: string, itemId: number): Promise<string> {
    const imagePath: string = `${itemId}_large.jpg`;
    return this.downloadImage(imageUrl, imagePath)
      .then(() => `/${this.path}/images/${imagePath}`);
  }
}
