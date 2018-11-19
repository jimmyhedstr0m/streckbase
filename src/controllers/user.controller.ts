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
  if (req.params.id === undefined) return res.sendStatus(404);

  const offset = req.query.offset ? parseInt(req.query.offset) : null;
  const limit = req.query.limit ? parseInt(req.query.limit) : null;

  userService.getUserPurchases(req.params.id, limit, offset)
    .then((user: User) => res.json(user));
}