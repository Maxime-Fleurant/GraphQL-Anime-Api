import Container, { Service } from 'typedi';
import _ from 'lodash';
import DataLoader from 'dataloader';
import { CharacterLoader } from '../modules/character/loaders/character.loader';

@Service()
export class Loader {}
