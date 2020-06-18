import { InjectRepository } from 'typeorm-typedi-extensions';
import { Repository } from 'typeorm';
import DataLoader from 'dataloader';
import { Review } from '../reviews.type';

export class ReviewLoaders {
  constructor(@InjectRepository(Review) private reviewRepo: Repository<Review>) {}

  batchFindByAnime: (keys: readonly number[]) => Promise<Review[][]> = async (keys) => {
    const reviews = await this.reviewRepo
      .createQueryBuilder('review')
      .where('review.anime in (:...animeIds)', { animeIds: keys })
      .getMany();

    const formatedReview = keys.map((key) => {
      return reviews.filter((review) => {
        return review.animeId === key;
      });
    });

    return formatedReview;
  };

  batchFindByUser: (keys: readonly number[]) => Promise<Review[][]> = async (keys) => {
    const reviews = await this.reviewRepo
      .createQueryBuilder('review')
      .where('review.user in (:...userIds)', { userIds: keys })
      .getMany();

    const formatedReview = keys.map((key) => {
      return reviews.filter((review) => {
        return review.userId === key;
      });
    });

    return formatedReview;
  };

  createLoaders = () => {
    return {
      batchFindByAnime: new DataLoader<number, Review[]>((keys) => this.batchFindByAnime(keys)),
      batchFindByUser: new DataLoader<number, Review[]>((keys) => this.batchFindByUser(keys)),
    };
  };
}
