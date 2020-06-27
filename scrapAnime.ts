import axios from 'axios';
import bluebird from 'bluebird';
import _ from 'lodash';
import { createConnection, getRepository } from 'typeorm';
import { Genre } from './src/modules/genre/genre.type';
import { Anime } from './src/modules/anime/anime.type';
import { Tag } from './src/modules/tag/tag.type';
import { Character } from './src/modules/character/character.type';

const start = async () => {
  await createConnection();

  const genreRepo = getRepository(Genre);
  const tagRepo = getRepository(Tag);
  const animeRepo = getRepository(Anime);
  const characterRepo = getRepository(Character);

  // Genre
  const genreQuery = `
    query {
      GenreCollection
    }
  `;

  const genres = await axios.post(
    'https://graphql.anilist.co',
    JSON.stringify({ query: genreQuery }),
    {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    }
  );

  const formatedGenres = genres.data.data.GenreCollection.map((genre: any) => {
    return {
      name: genre,
    };
  });

  await genreRepo
    .createQueryBuilder()
    .insert()
    .values(formatedGenres)
    .onConflict(`("name") DO NOTHING`)
    .execute();

  // Anime
  const animeQuery = `
    query ($page: Int){
      Page(page:$page, perPage:50){
        pageInfo {
          total
          perPage
          currentPage
          lastPage
          hasNextPage
        }
        media(type:ANIME, sort:POPULARITY_DESC, format:TV, isAdult:false, popularity_greater:5000) {
          id
          title {
            romaji
            english
            native
          }
          description(asHtml: true)
          bannerImage
          coverImage {
            extraLarge
            large
          }
          genres
          trailer{
            site
            id
          }
          status
          format
          popularity
          characters(sort:FAVOURITES_DESC){
            nodes{
              image{
                large
                medium
              }
              name{
                native
                full
              }
              description(asHtml: true)
            }
          }
          tags {
            name
          }
        }
      }
    }
  `;

  const animesList = await bluebird.map(new Array(30).fill(''), async (item, index) => {
    const animes = await axios.post(
      'https://graphql.anilist.co',
      JSON.stringify({ query: animeQuery, variables: { page: index + 1 } }),
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    );

    return animes.data.data.Page.media;
  });

  const formatedAnimeList = _.flatten(animesList).filter(
    (anime) => anime.trailer && anime.trailer.site === 'youtube'
  );
  console.log(formatedAnimeList.length);

  const tagList = formatedAnimeList.map((anime) => anime.tags);
  const flatTagList = _.flatten(tagList);
  const uniqTagList = _.uniqBy(flatTagList, (el) => {
    return el.name;
  });

  await tagRepo.createQueryBuilder().insert().values(uniqTagList).execute();
  const dataBaseTagList = await tagRepo.find();

  const savedAnimeList = bluebird.map(formatedAnimeList, async (anime, index) => {
    const formatedTag = anime.tags.map((tag: any) => {
      return dataBaseTagList.find((dbTag) => dbTag.name === tag.name);
    });

    const formatedCharacter = anime.characters.nodes.map((character: any) => {
      return characterRepo.create({
        name: character.name.full,
        nativeName: character.name.native,
        largeImg: character.image.large,
        mediumImg: character.image.medium,
        description: character.description,
      });
    });

    const dbGenres = await genreRepo.find();
    const formatedGenre = anime.genres.map((genre: any) => {
      return dbGenres.find((dbGenre) => dbGenre.name === genre);
    });

    const formatedAnime = animeRepo.create({
      englishTitle: anime.title.english,
      romajiTitle: anime.title.romaji,
      nativeTitle: anime.title.native,
      desciption: anime.description,
      bannerImage: anime.bannerImage,
      xLargeCoverImage: anime.coverImage.extraLarge,
      largeCoverImage: anime.coverImage.large,
      trailer: anime.trailer.id,
      status: anime.status,
      format: anime.format,
      popularity: anime.popularity,
      tags: formatedTag,
      characters: formatedCharacter,
      studio: { id: 1 },
      genres: formatedGenre,
    });

    await animeRepo.save(formatedAnime);

    console.log(`saved ${index}`);
  });
};

start();
