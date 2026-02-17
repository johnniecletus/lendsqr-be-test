
import bcrypt from "bcrypt";

export const hashPassword = async (value: string): Promise<string> => {
  return bcrypt.hash(value, 10);
};

export const comparePassword = async (
  value: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(value, hash);
};

