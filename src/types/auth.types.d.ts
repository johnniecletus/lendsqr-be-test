import { knex } from "knex";

export type PublicUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
};

export type SignupInput = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type AuthResult = {
  token: string;
  user: PublicUser;
};

export type UserEntity = PublicUser & {
  passwordHash: string;
};

export type DbOrTx = Knex | Knex.Transaction;

export type UserRow = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  password_hash: string;
};

export type AuthServiceDeps = {
  db: Knex;
  users: UserRepository;
  wallets: WalletRepository;
};
