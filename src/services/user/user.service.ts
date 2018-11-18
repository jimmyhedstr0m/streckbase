import { User } from './user';
import { User as DBUser } from '../../repositories/user/user';
import { UserRepository } from '../../repositories/user/user.repository';

export class UserService {
  private userRepository: UserRepository;
  
  constructor() {
    this.userRepository = new UserRepository();
  }

  getUsers(): Promise<User[]> {
    return this.userRepository.getUsers()
      .then((dbUsers: DBUser[]) => {
        const users: User[] = dbUsers.map((dbUser: DBUser) => ({
          id: dbUser.user_id,
          email: dbUser.email,
          firstname: dbUser.firstname,
          lastname: dbUser.lastname,
          debt: dbUser.debt || 0
        }));

        return users;
      });
  }

}

