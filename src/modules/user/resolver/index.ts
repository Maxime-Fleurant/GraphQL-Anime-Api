import { Resolver, Arg, Mutation, Query } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Repository } from 'typeorm';

import { User } from '../user.type';
import { CreateUserInput } from './user-input';
import { Bcrypt } from '../../../common/third-party/bcrypt';
import { Jwt } from '../../../common/third-party/jwt';
import { LoginResult } from './types/login';

@Resolver(() => User)
export class UserResolver {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private bcrypt: Bcrypt,
    private jwt: Jwt
  ) {}

  @Query(() => LoginResult)
  async login(
    @Arg('name') name: string,
    @Arg('password') password: string
  ): Promise<{ token: string | null }> {
    const user = await this.userRepo.findOne({ name });

    if (user) {
      if (await this.bcrypt.bcrypt.compare(password, user.password)) {
        const token = this.jwt.jwt.sign(
          { id: user.id, role: user.role },
          process.env.JWT_SECRET as string,
          { expiresIn: 120 }
        );

        return { token };
      }
    }

    return { token: null };
  }

  @Mutation(() => User)
  async createUser(
    @Arg('input') { name, password }: CreateUserInput
  ): Promise<User & { token: string }> {
    const hashPassword = await this.bcrypt.bcrypt.hash(password, 10);
    const newUser = this.userRepo.create({ password: hashPassword, name, role: 'regular' });
    const savedUser = await this.userRepo.save(newUser);
    const token = this.jwt.jwt.sign(
      { id: savedUser.id, role: savedUser.role },
      process.env.JWT_SECRET as string,
      { expiresIn: 120 }
    );

    return { ...savedUser, token };
  }
}
