import { MysqlError } from "mysql";

import dbConnection from "@config/dbConnection";

export class BaseRepository {

  constructor() { }

  dbQuery<T>(query: string, params = []): Promise<T> {
    return new Promise((resolve, reject) => {
      dbConnection.query(query, params, (err: MysqlError, result: T) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }

}
