import express, { Router } from "express";

import * as userController from "./controllers/user.controller";
import * as itemController from "./controllers/item.controller";
import * as purchaseController from "./controllers/purchase.controller";
import * as systembolagetController from "./controllers/systembolaget.controller";

const router: Router = express.Router();

// router.use((req, res, next) => next());

router.get("/users/purchases", userController.getFeedPurchases);
router.get("/users/:id?", userController.getUsers);
router.get("/users/:userId/purchases/:purchaseId?", userController.getUserPurchases);
router.post("/users", userController.createUser);
router.post("/users/:userId/purchases", userController.createPurchase);
router.put("/users/:id", userController.updateUser);
router.delete("/users/:userId/purchases/:purchaseId", userController.deleteUserPurchase);

router.get("/items/:id?", itemController.getItems);
router.get("/items/barcodes/:barcode", itemController.getBarcodeItem);
router.put("/items/:id", itemController.updateItem);

router.get("/systembolaget", systembolagetController.searchItem);
router.get("/systembolaget/image", systembolagetController.getImage);

router.get("/purchases", purchaseController.getPurchases);
router.get("/purchases/:id", purchaseController.getPurchase);

export default router;