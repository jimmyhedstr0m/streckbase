import { Purchase } from "@services/purchase/purchase";

export class User {
  id: string = null;
  email?: string = null;
  firstname: string = null;
  lastname: string = null;
  debt: number = null;
  lobare: boolean = null;
  admin: boolean = null;
  purchases?: Purchase[];
}
