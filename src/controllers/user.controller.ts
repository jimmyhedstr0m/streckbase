// import { default as User, UserModel, AuthToken } from "../models/User";
// const user = require('./../models/user');
import { UserService } from "../services/user/user.service";
import { User } from "../services/user/user";

const userService = new UserService();

export const getUsers = (req, res) => {
  // const userId = req.params.userId;

  userService.getUsers()
    .then((users: User[]) => res.json(users))
    .catch((err: Error) => console.log("err", err));
  // res.json([]);

  // user.getAll()
  //   .then((results) => res.json(results));
    

  // if (userId === undefined) {
  //   res.sendStatus(400);
  // } else {
  //   user.get(userId, (_err, results) => {
  //     // if (error) {
  //     //   res.sendStatus(500);
  //     //   return;
  //     // }

  //     res.json(results);
  //   });
  // }
}
