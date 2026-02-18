import type { Knex } from "knex";
import { describe, expect, it, jest, beforeEach } from "@jest/globals";
import { UnauthorizedError, ConflictError } from "../../src/common/errors";
import { createAuthService } from "../../src/modules/auth/auth.service";
import type { UserRepository } from "../../src/modules/auth/repository";
import type { WalletRepository } from "../../src/modules/wallet/repository";

const mockIsBlacklisted = jest.mocked(isBlacklisted);
const mockHashPassword = jest.mocked(hashPassword);
const mockComparePassword = jest.mocked(comparePassword);
const mockSignJWT = jest.mocked(signJWT);

jest.mock("../../src/modules/auth/karma.client", () => ({
  isBlacklisted: jest.fn(),
}));

jest.mock("../../src/modules/auth/password.service", () => ({
  hashPassword: jest.fn(),
  comparePassword: jest.fn(),
}));

jest.mock("../../src/modules/auth/token.service", () => ({
  signJWT: jest.fn(),
}));

import { isBlacklisted } from "../../src/modules/auth/karma.client";
import {
  hashPassword,
  comparePassword,
} from "../../src/modules/auth/password.service";
import { signJWT } from "../../src/modules/auth/token.service";

function makeFakeDb(): Knex {
  return {
    transaction: async (cb: (trx: Knex.Transaction) => unknown) =>
      cb({} as Knex.Transaction),
  } as unknown as Knex;
}

describe("AuthService", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("creates a user + wallet on signup and returns token + public user", async () => {
    const db = makeFakeDb();

    const users: UserRepository = {
      findByEmail: async () => null,
      findById: async () => null,
      create: async () => ({
        id: "u1",
        email: "johncletus@lendsqrbetest.com",
        firstName: "John",
        lastName: "Cletus",
        passwordHash: "hashed",
      }),
    };

    let walletCreateCalled = false;

    const wallets: WalletRepository = {
      create: async () => {
        walletCreateCalled = true;
        return { id: "w1", userId: "u1", balanceUnits: 0n };
      },
      findByUserId: async () => null,
      updateBalanceUnits: async () => undefined,
    };

    mockIsBlacklisted.mockResolvedValue(false);
    mockHashPassword.mockResolvedValue("hashed");
    mockSignJWT.mockReturnValue("token");

    const authService = createAuthService({ db, users, wallets });

    const result = await authService.signup({
      email: "johncletus@lendsqrbetest.com",
      firstName: "John",
      lastName: "Cletus",
      password: "password123",
    });

    expect(result.token).toBe("token");
    expect(walletCreateCalled).toBe(true);

    expect(result.user).toEqual({
      id: "u1",
      email: "johncletus@lendsqrbetest.com",
      firstName: "John",
      lastName: "Cletus",
    });
  });

  it("rejects signup if karma says blacklisted", async () => {
    const db = makeFakeDb();

    const users: UserRepository = {
      findByEmail: async () => null,
      findById: async () => null,
      create: async () => {
        throw new Error("should not be called");
      },
    };

    const wallets: WalletRepository = {
      create: async () => {
        throw new Error("should not be called");
      },
      findByUserId: async () => null,
      updateBalanceUnits: async () => undefined,
    };

    mockIsBlacklisted.mockResolvedValue(true);

    const authService = createAuthService({ db, users, wallets });

    await expect(
      authService.signup({
        email: "blocked@x.com",
        firstName: "Block",
        lastName: "Listed",
        password: "password123",
      })
    ).rejects.toThrow(UnauthorizedError);
  });

  it("rejects signup if email already exists", async () => {
    const db = makeFakeDb();

    const users: UserRepository = {
      findByEmail: async () => ({
        id: "u1",
        email: "johncletus@lendsqrbetest.com",
        firstName: "John",
        lastName: "Cletus",
        passwordHash: "hashed",
      }),
      findById: async () => null,
      create: async () => {
        throw new Error("not needed");
      },
    };

    const wallets: WalletRepository = {
      create: async () => {
        throw new Error("not needed");
      },
      findByUserId: async () => null,
      updateBalanceUnits: async () => undefined,
    };

    const authService = createAuthService({ db, users, wallets });

    await expect(
      authService.signup({
        email: "johncletus@lendsqrbetest.com",
        firstName: "John",
        lastName: "Cletus",
        password: "password123",
      })
    ).rejects.toThrow(ConflictError);
  });

  it("rejects login if password is incorrect", async () => {
    const db = makeFakeDb();

    const users: UserRepository = {
      findByEmail: async () => ({
        id: "u1",
        email: "johncletus@lendsqrbetest.com",
        firstName: "John",
        lastName: "Cletus",
        passwordHash: "hashed",
      }),
      findById: async () => null,
      create: async () => {
        throw new Error("not needed");
      },
    };

    const wallets: WalletRepository = {
      create: async () => {
        throw new Error("not needed");
      },
      findByUserId: async () => null,
      updateBalanceUnits: async () => undefined,
    };

    mockComparePassword.mockResolvedValue(false);

    const authService = createAuthService({ db, users, wallets });

    await expect(
      authService.login({
        email: "johncletus@lendsqrbetest.com",
        password: "wrong-password",
      })
    ).rejects.toThrow(UnauthorizedError);

    expect(signJWT).not.toHaveBeenCalled();
  });
});
