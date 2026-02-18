import { Knex } from "knex";
import { UserEntity } from "@/types/auth.types";
export interface UserRepository {
    findByEmail(email: string, tx?: Knex.Transaction): Promise<UserEntity | null>;
    findById(id: string, tx?: Knex.Transaction): Promise<UserEntity | null>;
    create(data: {
        email: string;
        firstName: string;
        lastName: string;
        passwordHash: string;
    }, tx?: Knex.Transaction): Promise<UserEntity>;
}
export declare function createUserRepository(db: Knex): UserRepository;
