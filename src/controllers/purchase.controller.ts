import { PurchaseService } from "./../services/purchase/purchase.service";
import { Purchase } from "./../services/purchase/purchase";

const purchaseService = new PurchaseService();

export const getPurchases = (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : null;
    const offset = req.query.offset ? parseInt(req.query.offset) : null;

    purchaseService.getPurchases(limit, offset)
      .then((purchases: Purchase[]) => res.json(purchases));
}
