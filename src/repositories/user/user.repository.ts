import dbConnection from "../../config/dbConnection";
import { User } from './user';

export class UserRepository {

  constructor() { }

  getUsers(): Promise<User[]> {
    return new Promise((resolve, reject) => {
      dbConnection.query('SELECT user_id, firstname, lastname, email, debt FROM Users', (err: Error, results: User[]) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  }

}

