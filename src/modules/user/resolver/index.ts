import { Resolver, Arg, Mutation } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Repository } from 'typeorm';

import { User } from '../user.type';
import { CreateUserInput } from './user-input';
import { Bcrypt } from '../../../common/third-party/bcrypt';
import { Jwt } from '../../../common/third-party/jwt';

@Resolver(() => User)
export class UserResolver {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private bcrypt: Bcrypt,
    private jwt: Jwt
  ) {}

  @Mutation(() => User)
  async createUser(@Arg('input') { name, password }: CreateUserInput): Promise<User> {
    const hashPassword = await this.bcrypt.bcrypt.hash(password, 10);
    const newUser = this.userRepo.create({ password: hashPassword, name, role: 'regular' });
    const savedUser = await this.userRepo.save(newUser);
    console.log(process.env.JWT_SECRET);
    const token = this.jwt.jwt.sign(
      { id: savedUser.id, role: savedUser.role },
      process.env.JWT_SECRET as string,
      { expiresIn: 120 }
    );
    console.log(token);
    return this.userRepo.save(newUser);
  }
}
