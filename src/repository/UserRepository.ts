import { AppDataSource } from "../config/database";
import { User } from "../entities/User";

export const UserRepository = AppDataSource.getRepository(User).extend({
  async createUser(userData: Partial<User>) {
    const user = this.create(userData); 
    return this.save(user);
  },

  async findUserById(id: number): Promise<User> {
    const user = await this.findOneBy({ id });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  },

  async findByName(name: string): Promise<User[]> {
    return this.createQueryBuilder("user")
      .where("LOWER(user.name) LIKE LOWER(:name)", { name: `%${name}%` })
      .getMany();
  },

  async findByEmail(email: string): Promise<User | null> {
    return this.findOneBy({ email });
  },
});