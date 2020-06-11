import { Loaders } from '../../app/loaders';

export interface IContext {
  loaders: ReturnType<Loaders['createLoaders']>;
  user: { id: number; role: string } | null;
}
