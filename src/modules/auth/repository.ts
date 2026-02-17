import { Knex } from "knex";
import { generateId } from "@/common/ids";
import { UserEntity, UserRow, DbOrTx } from "@/types/auth.types";



function mapUser(row: UserRow): UserEntity {
  return {
    id: row.id,
    email: row.email,
    firstName: row.first_name,
    lastName: row.last_name,
    passwordHash: row.password_hash,
  };
}

export interface UserRepository {
  findByEmail(email: string, tx?: Knex.Transaction): Promise<UserEntity | null>;
  findById(id: string, tx?: Knex.Transaction): Promise<UserEntity | null>;
  create(data: { email: string; firstName: string; lastName: string; passwordHash: string }, tx?: Knex.Transaction): Promise<UserEntity>;
}

export function createUserRepository(db: Knex): UserRepository {
  const findByEmail = async (email: string, tx?: Knex.Transaction): Promise<UserEntity | null> => {
    const conn: DbOrTx = tx ?? db;
    const row = await conn<UserRow>("users").where({ email }).first();
    return row ? mapUser(row) : null;
  };

  const findById = async (id: string, tx?: Knex.Transaction): Promise<UserEntity | null> => {
    const conn: DbOrTx = tx ?? db;
    const row = await conn<UserRow>("users").where({ id }).first();
    return row ? mapUser(row) : null;
  };

  const create = async (
    data: { email: string; firstName: string; lastName: string; passwordHash: string },
    tx?: Knex.Transaction,
  ): Promise<UserEntity> => {
    const conn: DbOrTx = tx ?? db;
    const id = generateId();
    await conn("users").insert({
      id,
      email: data.email,
      first_name: data.firstName,
      last_name: data.lastName,
      password_hash: data.passwordHash,
    });

    return {
      id,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      passwordHash: data.passwordHash,
    };
  };

  return {
    findByEmail,
    findById,
    create,
  };
}
