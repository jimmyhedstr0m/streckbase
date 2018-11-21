import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import path from "path";

const app = express();

dotenv.load({ path: ".env.dev" });

import * as userController from "./controllers/user.controller";
import * as itemController from "./controllers/item.controller";
import * as purchaseController from "./controllers/purchase.controller";

// import { Mapper, DBItem, Item } from "./helpers/mapper";

app.set("port", process.env.PORT || 8080);
app.set("json spaces", 2);
app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get("/users/:id?", userController.getUsers);
app.get("/users/:userId/purchases/:purchaseId?", userController.getUserPurchases);
app.get("/items/:id?", itemController.getItems);
app.get("/items/barcodes/:barcode", itemController.getBarcodeItem);
app.get("/purchases", purchaseController.getPurchases);
app.get("/test", (req, res) => {
  res.json({ ok: "yes" });
})

app.use((err, req, res, next) => {
  console.error("stack", err.stack);
  res.sendStatus(500);
});

app.listen(app.get("port"), () => {
  console.log(`Listening on port ${app.get("port")}`);
});



// const item: DBItem = {
//   item_id: 1337,
//   item_text: "cool grej",
//   barcode: 123456789
// };
// const mapper = new Mapper(DBItem, Item)

// const destination = mapper
//   .createMap(item)
//   .forMember((source: DBItem) => ({
//     id: source.item_id,
//     description: source.item_text,
//   }))
//   .map();
// console.log('destination', destination);