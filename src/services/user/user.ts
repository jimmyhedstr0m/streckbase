import { Purchase } from "./../purchase/purchase";

export interface User {
  id: string;
  email?: string;
  firstname: string;
  lastname: string;
  debt: number;
  purchases?: Purchase[];
}
