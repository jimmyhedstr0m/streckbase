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
    userService.getUsers()
      .then((users: User[]) => res.json(users));
  }

}