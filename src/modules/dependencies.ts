import { db } from "@/db/knex";
import { createAuthService } from "@/modules/auth/auth.service";
import { createUserRepository } from "@/modules/auth/repository";
import {
  createWalletRepository,
  createWalletTransactionRepository,
} from "@/modules/wallet/repository";
import { createWalletService } from "@/modules/wallet/wallet.service";

const users = createUserRepository(db);
const wallets = createWalletRepository(db);
const walletTransactions = createWalletTransactionRepository(db);

export const authService = createAuthService({
  db,
  users,
  wallets,
});

export const walletService = createWalletService({
  db,
  wallets,
  transactions: walletTransactions,
});
