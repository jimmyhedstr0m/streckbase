import { User } from "./user";
import { User as DBUser } from "./../../repositories/user/user";
import { UserRepository } from "./../../repositories/user/user.repository";
import { PurchaseRepository } from "./../../repositories/purchase/purchase.repository";
import { Purchase } from "./../../services/purchase/purchase";
import { Purchase as DBPurchase } from "./../../repositories/purchase/purchase";
import { Item } from "./../item/item";

export class UserService {
  private userRepository: UserRepository;
  private purchaseRepository: PurchaseRepository;

  constructor() {
    this.userRepository = new UserRepository();
    this.purchaseRepository = new PurchaseRepository();
  }

  private map(dbUser: DBUser): User {
    if (!dbUser) return null;

    return {
      id: dbUser.user_id,
      email: dbUser.email,
      firstname: dbUser.firstname,
      lastname: dbUser.lastname,
      debt: dbUser.debt
    }
  }

  getUser(id: string): Promise<User> {
    return this.userRepository.getUser(id)
      .then((dbUser: DBUser) => this.map(dbUser));
  }

  getUsers(limit: number, offset: number): Promise<User[]> {
    limit = typeof limit === "number" ? limit : 20;
    offset = typeof offset === "number" ? offset : 0;

    return this.userRepository.getUsers(limit, offset)
      .then((dbUsers: DBUser[]) => dbUsers.map<User>((dbUser: DBUser) => this.map(dbUser)));
  }

  getUserPurchase(userId: string, purchaseId: number): Promise<User> {
    let currentUser: User;

    return this.getUser(userId)
      .then((user: User) => {
        if (!user) return null;
        currentUser = user;

        return this.purchaseRepository.getPurchase(purchaseId)
      })
      .then((purchase: DBPurchase) => {
        currentUser.purchases = <Purchase[]>[{
          id: purchase.id,
          date: purchase.date,
          item: <Item>({
            id: purchase.item_id,
            name: purchase.name,
            price: purchase.price,
            volume: purchase.volume,
            alcohol: purchase.alcohol,
            barcodes: purchase.codes ? purchase.codes.split(",") : []
          })
        }];

        return currentUser;
      });
  }

  getUserPurchases(userId: string, limit: number, offset: number): Promise<User> {
    let currentUser: User;
    limit = typeof limit === "number" ? limit : 20;
    offset = typeof offset === "number" ? offset : 0;

    return this.getUser(userId)
      .then((user: User) => {
        if (!user) return null;
        currentUser = user;

        return this.purchaseRepository.getUserPurchases(userId, limit, offset)
      })
      .then((purchases: DBPurchase[]) => {
        currentUser.purchases = purchases.map((purchase: DBPurchase) => <Purchase>({
          id: purchase.id,
          date: purchase.date,
          item: <Item>({
            id: purchase.item_id,
            name: purchase.name,
            price: purchase.price,
            volume: purchase.volume,
            alcohol: purchase.alcohol,
            barcodes: purchase.codes ? purchase.codes.split(",") : []
          })
        }));

        return currentUser;
      });
  }

}
