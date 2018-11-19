import { BaseRepository } from "./../base.repository";
import { User } from "./user";

export class UserRepository extends BaseRepository {

  constructor() {
    super();
  }

  getUser(id: string): Promise<User[]> {
    return this.dbQuery("SELECT user_id, firstname, lastname, email, debt FROM Users WHERE user_id=?", [id]);
  }

  getUsers(limit: number, offset: number): Promise<User[]> {
    return this.dbQuery(`
      SELECT user_id, firstname, lastname, email, debt
      FROM Users
      LIMIT ?
      OFFSET ?
    `, [limit, offset]);
  }

}
