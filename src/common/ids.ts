import { randomUUID } from "crypto";

export const generateId = () => randomUUID();

export const generateRef = (prefix: string) => `${prefix}_${randomUUID().replace(/-/g, "")}`;

