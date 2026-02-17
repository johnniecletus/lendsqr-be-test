import { ServiceUnavailableError } from "@/common/errors";
import { env } from "@/config/env";


export const isBlacklisted = async (identity: string): Promise<boolean> => {
  const url = `${env.ADJUTOR_BASE_URL}/verification/karma/${encodeURIComponent(identity)}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${env.ADJUTOR_BEARER_TOKEN}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new ServiceUnavailableError(
      "Could not validate Karma blacklist at this time"
    );
  }

  const payload = (await response.json()) as Record<string, unknown>;

  const data = payload["data"] as Record<string, unknown> | undefined;

  const candidates = [
    payload["blacklisted"],
    payload["isBlacklisted"],
    payload["status"],
    data?.["blacklisted"],
    data?.["status"],
  ];

  return candidates.some((value) => {
    if (typeof value === "boolean") {
      return value;
    }

    if (typeof value === "string") {
      const normalized = value.toLowerCase();
      return (
        normalized.includes("black") ||
        normalized === "deny" ||
        normalized === "blocked"
      );
    }

    return false;
  });
};
