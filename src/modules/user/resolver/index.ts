import { Resolver, Arg, Mutation, Query, FieldResolver, Root, Ctx } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Repository } from 'typeorm';

import { User, LoginResult, CreateUserInput } from '../user.type';
import { Bcrypt } from '../../../common/third-party/bcrypt';
import { Jwt } from '../../../common/third-party/jwt';
import { Review } from '../../reviews/reviews.type';
import { IContext } from '../../../common/types/IContext';
import { createGenericResolver } from '../../../common/GenericResolver';

@Resolver(() => User)
export class UserResolver extends createGenericResolver('User', User) {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private bcrypt: Bcrypt,
    private jwt: Jwt
  ) {
    super();
  }

  @FieldResolver()
  async reviews(@Root() parent: Review, @Ctx() context: IContext): Promise<Review[]> {
    const reviews = await context.loaders.reviewLoaders.batchFindByUser.load(parent.id);

    return reviews;
  }

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
