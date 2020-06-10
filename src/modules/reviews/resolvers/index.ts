import { InjectRepository } from 'typeorm-typedi-extensions';
import { Repository } from 'typeorm';
import { FieldResolver, Resolver, Root, Ctx, Mutation, Arg } from 'type-graphql';

import { Review } from '../reviews.type';
import { createGenericResolver } from '../../../common/GenericResolver';
import { Anime } from '../../anime/anime.type';
import { IContext } from '../../../app';
import { CreateReviewInput } from './types/create-review.types';

@Resolver(() => Review)
export class ReviewResolver extends createGenericResolver('Review', Review) {
  constructor(@InjectRepository(Review) private reviewRepo: Repository<Review>) {
    super();
  }

  @FieldResolver()
  async anime(@Root() parent: Review, @Ctx() context: IContext): Promise<Anime | undefined> {
    const anime = await context.loaders.animeLoaders.batchFindById.load(parent.animeId);

    return anime;
  }

  @Mutation(() => Review)
  async createReview(
    @Arg('input') { summary, score, body, animeId, userId }: CreateReviewInput
  ): Promise<Review> {
    const newReview = this.reviewRepo.create({
      summary,
      score,
      body,
      anime: { id: animeId },
      user: { id: userId },
    });

    const savedReview = await this.reviewRepo.save(newReview);

    return savedReview;
  }
}
