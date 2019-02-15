import { MysqlError, PoolConnection } from "mysql";

import dbConnection from "@config/dbConnection";

export class BaseRepository {

  constructor() { }

  dbQuery<T>(query: string, params = []): Promise<T> {
    return new Promise((resolve, reject) => {
      dbConnection.getConnection((poolErr: MysqlError, connection: PoolConnection) => {

        if (poolErr) {
          connection.release();
          reject(poolErr);
        } else {
          connection.query(query, params, (err: MysqlError, result: T) => {
            connection.release();

            if (err) return reject(err);
            resolve(result);
          });
        }

      })
    });
  }

  beginTransaction(connection: PoolConnection): Promise<void> {
    return new Promise((resolve, reject) => {
      connection.beginTransaction((err) => {
        if (err) {
          connection.rollback(() => {
            connection.release();
            reject(err);
          });
        } else {
          resolve();
        }
      });
    });
  }


  poolQuery(connection: PoolConnection, query: string, values: any[]): Promise<any> {
    return new Promise((resolve, reject) => {
      connection.query(query, values, (err: MysqlError, results: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }

  commit(connection: PoolConnection): Promise<void> {
    return new Promise((resolve, reject) => {
      connection.commit((err: MysqlError) => {
        if (err) {
          connection.rollback(() => {
            connection.release();
            reject(err);
          });
        } else {
          connection.release();
          resolve();
        }
      });
    });
  }

}
