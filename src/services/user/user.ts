import { Purchase } from "./../purchase/purchase";

export class User {
  id: string = null;
  email?: string = null;
  firstname: string = null;
  lastname: string = null;
  debt: number = null;
  lobare: boolean = null;
  purchases?: Purchase[];
}
