import { BaseRepository } from "./../base.repository";
import { User } from "./user";
import { User as APIUser } from "@services/user/user";

export class UserRepository extends BaseRepository {
  constructor() {
    super();
  }

  getUser(id: string): Promise<User> {
    return this.dbQuery(
      `
      SELECT u.user_id, u.email, u.firstname, u.lastname, u.lobare, u.admin, u.debt,
        IFNULL(
          (SELECT SUM(i.price)
          FROM Purchases p
          JOIN Items i ON p.item_id = i.item_id
          WHERE u.user_id = p.user_id
          GROUP BY p.user_id),
        0) AS totalDebt
      FROM Users u
      WHERE user_id = ?
    `,
      [id]
    ).then((res: any[]) => res[0]);
  }

  getUsers(limit: number, offset: number): Promise<User[]> {
    return this.dbQuery(
      `
      SELECT u.user_id, u.email, u.firstname, u.lastname, u.lobare, u.admin, u.debt,
        IFNULL(
          (SELECT SUM(i.price)
          FROM Purchases p
          JOIN Items i ON p.item_id = i.item_id
          WHERE u.user_id = p.user_id 
          GROUP BY p.user_id),
        0) AS totalDebt
      FROM Users u
      ORDER BY u.created_at ASC
      LIMIT ?
      OFFSET ?
    `,
      [limit, offset]
    );
  }

  getMonthlyHighscore(): Promise<User[]> {
    return this.dbQuery(`
      SELECT u.user_id, u.email, u.firstname, u.lastname, u.lobare, u.admin,
        IFNULL(
          (SELECT SUM(i.price)
          FROM Purchases p
          JOIN Items i ON p.item_id = i.item_id
          WHERE u.user_id = p.user_id 
            AND EXTRACT(YEAR FROM p.date) = YEAR(NOW())
            AND EXTRACT(MONTH FROM p.date) = MONTH(NOW())
            AND i.item_id NOT IN (130, 253)
          GROUP BY p.user_id),
        0) AS debt,
        IFNULL(
          (SELECT SUM(i.price)
          FROM Purchases p
          JOIN Items i ON p.item_id = i.item_id
          WHERE u.user_id = p.user_id 
            AND i.item_id NOT IN (569, 580, 590, 595)
          GROUP BY p.user_id),
        0) AS totalDebt
      FROM Users u
      WHERE u.lobare = 1
      ORDER BY debt
      DESC
    `);
  }

  updateDebt(id: string, debt: number): Promise<any> {
    return this.dbQuery(
      `
      UPDATE Users SET debt = ?
      WHERE user_id = ?
    `,
      [debt, id]
    );
  }

  createUser(user: APIUser): Promise<any> {
    return this.dbQuery(
      `
      INSERT INTO Users (user_id, firstname, lastname, email, debt, lobare, admin) VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
      [
        user.id,
        user.firstname,
        user.lastname,
        user.email,
        0,
        user.lobare,
        user.admin,
      ]
    );
  }

  updateUser(user: APIUser): Promise<any> {
    return this.dbQuery(
      `
      UPDATE Users SET email = ?, debt = ?, lobare = ?, admin = ? WHERE user_id = ?
    `,
      [user.email, user.debt, user.lobare, user.admin, user.id]
    );
  }
}
