import { Service } from 'typedi';
import { CharacterLoader } from '../modules/character/loaders';
import { StudioLoader } from '../modules/studio/loaders';
import { AnimeLoaders } from '../modules/anime/loaders';
import { GenreLoader } from '../modules/genre/loaders';

@Service()
export class Loaders {
  constructor(
    private characterLoader: CharacterLoader,
    private studioLoader: StudioLoader,
    private animeLoaders: AnimeLoaders,
    private genreLoaders: GenreLoader
  ) {}

  createLoaders() {
    return {
      characterLoaders: this.characterLoader.createLoaders(),
      studioLoaders: this.studioLoader.createLoaders(),
      animeLoaders: this.animeLoaders.createLoaders(),
      genreLoaders: this.genreLoaders.createLoaders(),
    };
  }
}
