import { Mapper } from "./../../helpers/mapper";
import { User } from "./user";
import { User as DBUser } from "./../../repositories/user/user";
import { UserRepository } from "./../../repositories/user/user.repository";
import { PurchaseRepository } from "./../../repositories/purchase/purchase.repository";
import { Purchase } from "./../../services/purchase/purchase";
import { Purchase as DBPurchase } from "./../../repositories/purchase/purchase";
import { Item } from "./../item/item";
import { Item as DBItem } from "./../../repositories/item/item";
import { subset } from "./../../helpers/subset";

export class UserService {
  private userRepository: UserRepository;
  private purchaseRepository: PurchaseRepository;

  constructor() {
    this.userRepository = new UserRepository();
    this.purchaseRepository = new PurchaseRepository();
  }

  private mapUser(dbUser: DBUser): User {
    const userMapper: Mapper<DBUser, User> = new Mapper(DBUser, User);
    return userMapper
      .createMap(dbUser)
      .forMember((dbUser) => <Partial<User>>{ id: dbUser.user_id })
      .map();
  }

  private mapPurchase(dbPurchase: DBPurchase): Purchase {
    const purchaseMapper: Mapper<DBPurchase, Purchase> = new Mapper(DBPurchase, Purchase);
    const itemMapper: Mapper<DBItem, Item> = new Mapper(DBItem, Item);

    return purchaseMapper
      .createMap(dbPurchase)
      .forMember((dbPurchase: DBPurchase) => {
        const item: Item = itemMapper
          .createMap(<DBItem>subset(DBItem, dbPurchase))
          .forMember((dbItem: DBItem) => <Partial<Item>>{
            id: dbItem.item_id,
            barcodes: dbItem.codes ? dbItem.codes.split(",") : []
          })
          .map();

        return <Partial<Purchase>>{ item };
      })
      .map();
  }

  getUser(id: string): Promise<User> {
    return this.userRepository.getUser(id)
      .then((dbUser: DBUser) => this.mapUser(dbUser));
  }

  getUsers(limit: number, offset: number): Promise<User[]> {
    return this.userRepository.getUsers(limit, offset)
      .then((dbUsers: DBUser[]) => dbUsers.map<User>((dbUser: DBUser) => this.mapUser(dbUser)));
  }

  getUserPurchase(userId: string, purchaseId: number): Promise<User> {
    let currentUser: User;

    return this.getUser(userId)
      .then((user: User) => {
        if (!user) return null;
        currentUser = user;

        return this.purchaseRepository.getPurchase(purchaseId)
      })
      .then((dbPurchase: DBPurchase) => {
        currentUser.purchases = <Purchase[]>[this.mapPurchase(dbPurchase)];
        return currentUser;
      });
  }

  getUserPurchases(userId: string, limit: number, offset: number): Promise<User> {
    let currentUser: User;

    return this.getUser(userId)
      .then((user: User) => {
        if (!user) return null;
        currentUser = user;

        return this.purchaseRepository.getUserPurchases(userId, limit, offset)
      })
      .then((purchases: DBPurchase[]) => {
        currentUser.purchases = <Purchase[]>purchases
          .map<Purchase>((dbPurchase: DBPurchase) => this.mapPurchase(dbPurchase));

        return currentUser;
      });
  }

}
