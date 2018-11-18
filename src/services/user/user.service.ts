import { User } from "./user";
import { User as DBUser } from "./../../repositories/user/user";
import { UserRepository } from "./../../repositories/user/user.repository";

export class UserService {
  private userRepository: UserRepository;
  
  constructor() {
    this.userRepository = new UserRepository();
  }

  private map(dbUser: DBUser): User {
    if (!dbUser) return null;

    return {
      id: dbUser.user_id,
      email: dbUser.email,
      firstname: dbUser.firstname,
      lastname: dbUser.lastname,
      debt: dbUser.debt
    }
  }

  getUser(id: string): Promise<User> {
    return this.userRepository.getUser(id)
      .then((dbUser: DBUser[]) => this.map(dbUser[0]));
  }

  getUsers(): Promise<User[]> {
    return this.userRepository.getUsers()
      .then((dbUsers: DBUser[]) => dbUsers.map<User>((dbUser: DBUser) => this.map(dbUser)));
  }

}
