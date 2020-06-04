import DataLoader from 'dataloader';

export class CreateSingleLoader {
  create(batchFn: any) {
    return new DataLoader((keys) => batchFn(keys));
  }
}
