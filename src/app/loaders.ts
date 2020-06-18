import { Service } from 'typedi';
import { CharacterLoader } from '../modules/character/loaders';
import { StudioLoader } from '../modules/studio/loaders';
import { AnimeLoaders } from '../modules/anime/loaders';
import { ReviewLoaders } from '../modules/reviews/loaders';
import { ExternalLinkLoaders } from '../modules/externalLink/loaders';

@Service()
export class Loaders {
  constructor(
    private characterLoader: CharacterLoader,
    private studioLoader: StudioLoader,
    private animeLoaders: AnimeLoaders,
    private reviewLoaders: ReviewLoaders,
    private externalLinkLoaders: ExternalLinkLoaders
  ) {}

  createLoaders() {
    return {
      characterLoaders: this.characterLoader.createLoaders(),
      studioLoaders: this.studioLoader.createLoaders(),
      animeLoaders: this.animeLoaders.createLoaders(),
      reviewLoaders: this.reviewLoaders.createLoaders(),
      externalLinkLoaders: this.externalLinkLoaders.createLoaders(),
    };
  }
}
