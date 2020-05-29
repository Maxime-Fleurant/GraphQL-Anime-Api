import 'reflect-metadata';

import Container, { Service } from 'typedi';

@Service()
export class Class1 {
  stuff = 1;

  constructor() {
    console.log('constructor');
  }

  public test() {
    console.log(this.stuff);
  }
}
