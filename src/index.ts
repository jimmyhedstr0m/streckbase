import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import path from "path";

const app = express();

dotenv.load({ path: ".env" });

import * as userController from "./controllers/user.controller";
import * as itemController from "./controllers/item.controller";
import * as purchaseController from "./controllers/purchase.controller";
import * as systembolagetController from "./controllers/systembolaget.controller";

app.set("port", process.env.PORT || 8080);
app.set("json spaces", 2);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use("/public", express.static(path.join(__dirname, "public")));

app.get("/api/users/purchases", userController.getFeedPurchases);
app.get("/api/users/:id?", userController.getUsers);
app.get("/api/users/:userId/purchases/:purchaseId?", userController.getUserPurchases);

app.post("/api/users/:userId/purchases", userController.createPurchase);

app.get("/api/items/:id?", itemController.getItems);
app.get("/api/items/barcodes/:barcode", itemController.getBarcodeItem);

app.get("/api/systembolaget", systembolagetController.searchItem);
app.get("/api/systembolaget/image", systembolagetController.getImage);

app.get("/api/purchases", purchaseController.getPurchases);
app.get("/api/test", (req, res) => {
  res.json({ ok: "yes" });
})

app.use((err, req, res, next) => {
  console.error("stack", err.stack);
  res.sendStatus(500);
});

app.listen(app.get("port"), () => {
  console.log(`Listening on port ${app.get("port")}`);
});
