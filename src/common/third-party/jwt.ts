import jwt from 'jsonwebtoken';
import { Service } from 'typedi';

@Service()
export class Jwt {
  jwt = jwt;
}
