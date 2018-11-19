import { UserService } from "./../services/user/user.service";
import { User } from "./../services/user/user";

const userService = new UserService();

export const getUsers = (req, res) => {
  const id = req.params.id;
  const offset = req.query.offset ? parseInt(req.query.offset) : null;
  const limit = req.query.limit ? parseInt(req.query.limit) : null;

  if (id !== undefined) {
    userService.getUser(id)
      .then((user: User) => {
        if (!user) return res.sendStatus(404);
        res.json(user);
      });
  } else {
    userService.getUsers(limit, offset)
      .then((users: User[]) => res.json(users));
  }

}