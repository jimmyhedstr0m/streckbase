import { UserService } from "@services/user/user.service";
import { User } from "@services/user/user";

const userService = new UserService();

export const getMonthlyHighscore = (_req, res) => {
  userService.getMonthlyHighscore()
    .then((users: User[]) => res.json(users));
}

