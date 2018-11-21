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
  private userMapper: Mapper<DBUser, User>;
  private itemMapper: Mapper<DBItem, Item>;
  private purchaseMapper: Mapper<DBPurchase, Purchase>;

  constructor() {
    this.userRepository = new UserRepository();
    this.purchaseRepository = new PurchaseRepository();
    this.userMapper = new Mapper(DBUser, User);
    this.itemMapper = new Mapper(DBItem, Item);
    this.purchaseMapper = new Mapper(DBPurchase, Purchase);
  }

  getUser(id: string): Promise<User> {
    return this.userRepository.getUser(id)
      .then((dbUser: DBUser) =>
        this.userMapper
          .createMap(dbUser)
          .forMember((dbUser) => <Partial<User>>{ id: dbUser.user_id })
          .map()
      );
  }

  getUsers(limit: number, offset: number): Promise<User[]> {
    limit = typeof limit === "number" ? limit : 20;
    offset = typeof offset === "number" ? offset : 0;

    return this.userRepository.getUsers(limit, offset)
      .then((dbUsers: DBUser[]) => dbUsers.map<User>((dbUser: DBUser) =>
        this.userMapper
          .createMap(dbUser)
          .forMember((dbUser) => <Partial<User>>{ id: dbUser.user_id })
          .map()
      ));
  }

  getUserPurchases(id: string, limit: number, offset: number): Promise<User> {
    let currentUser: User;
    limit = typeof limit === "number" ? limit : 20;
    offset = typeof offset === "number" ? offset : 0;

    return this.getUser(id)
      .then((user: User) => {
        if (!user) return null;
        currentUser = user;

        return this.purchaseRepository.getUserPurchases(id, limit, offset)
      })
      .then((purchases: DBPurchase[]) => {
        const getItem = (dbPurchase: DBPurchase) => {
          return this.itemMapper
            .createMap(<DBItem>subset(DBItem, dbPurchase))
            .forMember((dbItem: DBItem) => <Partial<Item>>{
              id: dbItem.item_id,
              barcodes: dbItem.codes ? dbItem.codes.split(",") : []
            })
            .map();
        }

        currentUser.purchases = purchases
          .map((dbPurchase: DBPurchase) =>
            this.purchaseMapper
              .createMap(dbPurchase)
              .forMember((dbPurchase: DBPurchase) => (<Partial<Purchase>>{ item: getItem(dbPurchase) }))
              .map()
          );

        return currentUser;
      });
  }

}
