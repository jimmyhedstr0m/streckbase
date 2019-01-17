import { BaseRepository } from "./../base.repository";
import { User } from "./user";
import { User as APIUser } from "./../../services/user/user";

export class UserRepository extends BaseRepository {
  private userKeys: string = "user_id, firstname, lastname, email, debt, lobare, admin";

  constructor() {
    super();
  }

  getUser(id: string): Promise<User> {
    return this.dbQuery(`SELECT ${this.userKeys} FROM Users WHERE user_id=?`, [id])
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

  createUser(user: APIUser): Promise<any> {
    return this.dbQuery(`
      INSERT INTO Users (${this.userKeys}) VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [user.id, user.firstname, user.lastname, user.email, 0, user.lobare, user.admin]);
  }

  updateUser(user: APIUser): Promise<any> {
    return this.dbQuery(`
      UPDATE Users SET email=?, debt=?, lobare=?, admin=? WHERE user_id=?
    `, [user.email, user.debt, user.lobare, user.admin, user.id]);
  }
}
