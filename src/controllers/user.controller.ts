import { UserService } from "./../services/user/user.service";
import { User } from "./../services/user/user";
import { Item } from "./../services/item/item";

const userService = new UserService();

export const getUsers = (req, res) => {
  const id: string = req.params.id;

  if (id !== undefined) {
    userService.getUser(id)
      .then((user: User) => {
        if (!user) return res.sendStatus(404);
        res.json(user);
      });
  } else {
    const offset = parseInt(req.query.offset, 10) || 0;
    const limit = parseInt(req.query.limit, 10) || 20;

    userService.getUsers(limit, offset)
      .then((users: User[]) => res.json(users));
  }
}

export const getUserPurchases = (req, res) => {
  const userId: string = req.params.userId;
  const purchaseId: number = req.params.purchaseId;

  if (userId === undefined) return res.sendStatus(400);

  if (purchaseId) {
    userService.getUserPurchase(userId, purchaseId)
      .then((user: User) => {
        if (!user) return res.sendStatus(404);
        res.json(user);
      });
  } else {
    const offset = parseInt(req.query.offset, 10) || 0;
    const limit = parseInt(req.query.limit, 10) || 20;

    userService.getUserPurchases(req.params.userId, limit, offset)
      .then((userPurchase: User) => res.json(userPurchase));
  }
}

export const createPurchase = (req, res) => {
  const userId: string = req.params.userId;
  const item: Item = req.body;
  if (userId === undefined || !item) return res.sendStatus(400);

  userService.createPurchase(userId, item)
    .then((userPurchase: User) => res.json(userPurchase));
}

export const getFeedPurchases = (req, res) => {
  const offset = parseInt(req.query.offset, 10) || 0;
  const limit = parseInt(req.query.limit, 10) || 20;

  userService.getFeedPurchases(limit, offset)
    .then((feedPurchases: User[]) => res.json(feedPurchases));
}

export const deleteUserPurchase = (req, res) => {
  const userId: string = req.params.userId;
  const purchaseId: number = req.params.purchaseId;

  userService.deleteUserPurchase(userId, purchaseId)
    .then(() => res.sendStatus(202));
}