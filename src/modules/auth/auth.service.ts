import { ConflictError, NotFoundError, UnauthorizedError } from "@/common/errors";
import { SignupInput, LoginInput, AuthResult, PublicUser, AuthServiceDeps } from "@/types/auth.types";
import { isBlacklisted } from "./karma.client";
import { hashPassword, comparePassword } from "./password.service";
import { signJWT } from "./token.service";
import { env } from "@/config/env";



function toPublicUser(user: {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}): PublicUser {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
  };
}

export function createAuthService({ db, users, wallets }: AuthServiceDeps) {
  const signup = async (input: SignupInput): Promise<AuthResult> => {
    const existingUser = await users.findByEmail(input.email);
    if (existingUser) {
      throw new ConflictError("Email already exists");
    }

    const blacklisted = await isBlacklisted(input.email);
    if (blacklisted) {
      throw new UnauthorizedError(
        "User is blacklisted on Karma and cannot be onboarded"
      );
    }

    const passwordHash = await hashPassword(input.password);

    const user = await db.transaction(async (trx: any) => {
      const createdUser = await users.create(
        {
          email: input.email,
          firstName: input.firstName,
          lastName: input.lastName,
          passwordHash,
        },
        trx
      );

      await wallets.create({ userId: createdUser.id }, trx);
      return createdUser;
    });

    const token = signJWT(
      { userId: user.id, email: user.email },
      env.JWT_EXPIRES_IN
    );

    return {
      token,
      user: toPublicUser(user),
    };
  };

  const login = async (input: LoginInput): Promise<AuthResult> => {
    const user = await users.findByEmail(input.email);
    if (!user) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const passwordValid = await comparePassword(
      input.password,
      user.passwordHash
    );
    if (!passwordValid) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const token = signJWT(
      { userId: user.id, email: user.email },
      env.JWT_EXPIRES_IN
    );

    return {
      token,
      user: toPublicUser(user),
    };
  };

  const getUserProfile = async (userId: string): Promise<PublicUser> => {
    const user = await users.findById(userId);
    if (!user) {
      throw new NotFoundError("User profile not found");
    }

    return toPublicUser(user);
  };

  return {
    signup,
    login,
    getUserProfile,
  };
}
