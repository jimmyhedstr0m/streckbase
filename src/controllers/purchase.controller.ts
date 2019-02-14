import { PurchaseService } from "@services/purchase/purchase.service";
import { Purchase } from "@services/purchase/purchase";

const purchaseService = new PurchaseService();

export const getPurchases = (req, res) => {
  const offset = parseInt(req.query.offset, 10) || 0;
  const limit = parseInt(req.query.limit, 10) || 20;

  purchaseService.getPurchases(limit, offset)
    .then((purchases: Purchase[]) => res.json(purchases));
}

export const getPurchase = (req, res) => {
  const purchaseId: number = req.params.id;
  if (!purchaseId) return res.sendStatus(404);

  purchaseService.getPurchase(purchaseId)
    .then((purchase: Purchase) => res.json(purchase));
}
