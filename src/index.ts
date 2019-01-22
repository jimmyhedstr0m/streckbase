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

app.use("/api/static", express.static(path.join(__dirname, "public")));

app.use((err, req, res, next) => {
  console.error("stack", err.stack);
  res.sendStatus(500);
});

app.get("/api/users/purchases", userController.getFeedPurchases);
app.get("/api/users/:id?", userController.getUsers);
app.post("/api/users", userController.createUser);
app.put("/api/users", userController.updateUser);
app.get("/api/users/:userId/purchases/:purchaseId?", userController.getUserPurchases);
app.delete("/api/users/:userId/purchases/:purchaseId", userController.deleteUserPurchase)

app.post("/api/users/:userId/purchases", userController.createPurchase);

app.get("/api/items/:id?", itemController.getItems);
app.get("/api/items/barcodes/:barcode", itemController.getBarcodeItem);

app.get("/api/systembolaget", systembolagetController.searchItem);
app.get("/api/systembolaget/image", systembolagetController.getImage);

app.get("/api/purchases", purchaseController.getPurchases);
app.get("/api/purchases/:id", purchaseController.getPurchase);
app.get("/api/test", (req, res) => {
  res.json({ ok: "yes" });
})

app.listen(app.get("port"), () => {
  console.log(`Listening on port ${app.get("port")}`);
});
