import { UserService } from "./../services/user/user.service";
import { User } from "./../services/user/user";

const userService = new UserService();

export const getUsers = (req, res) => {
  const id = req.params.id;

  if (id !== undefined) {
    userService.getUser(id)
      .then((user: User) => {
        if (!user) return res.sendStatus(404);
        res.json(user);
      });
  } else {
    const limit = req.query.limit ? parseInt(req.query.limit) : null;
    const offset = req.query.offset ? parseInt(req.query.offset) : null;

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
    const offset = req.query.offset ? parseInt(req.query.offset) : null;
    const limit = req.query.limit ? parseInt(req.query.limit) : null;

    userService.getUserPurchases(req.params.userId, limit, offset)
      .then((user: User) => res.json(user));
  }

}