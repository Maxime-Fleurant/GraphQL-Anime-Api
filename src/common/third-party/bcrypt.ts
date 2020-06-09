import bcrypt from 'bcrypt';
import { Service } from 'typedi';

@Service()
export class Bcrypt {
  bcrypt = bcrypt;
}
