import { BaseRepository } from "./../base.repository";
import { User } from "./user";

export class UserRepository extends BaseRepository {
  private userKeys: string = "user_id, firstname, lastname, email, debt";

  constructor() {
    super();
  }

  getUser(id: string): Promise<User> {
    return this.dbQuery(`SELECT ${this.userKeys}  FROM Users WHERE user_id=?`, [id])
      .then((res: any[]) => res[0]);
  }

  getUsers(limit: number, offset: number): Promise<User[]> {
    return this.dbQuery(`
      SELECT ${this.userKeys}
      FROM Users
      LIMIT ?
      OFFSET ?
    `, [limit, offset]);
  }

  updateDebt(id: string, debt: number): Promise<any> {
    return this.dbQuery(`
      UPDATE Users SET debt = ?
      WHERE user_id = ?
    `, [debt, id]);
  }
}
