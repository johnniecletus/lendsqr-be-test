export declare const env: {
    NODE_ENV: "development" | "test" | "production";
    PORT: number;
    DB_HOST: string;
    DB_PORT: number;
    DB_USER: string;
    DB_PASSWORD: string;
    DB_NAME: string;
    JWT_PRIVATE_KEY: string;
    JWT_PUBLIC_KEY: string;
    JWT_EXPIRES_IN: `${number}ms` | `${number}s` | `${number}m` | `${number}h` | `${number}d` | `${number}w` | `${number}y`;
    ADJUTOR_BASE_URL: string;
    ADJUTOR_BEARER_TOKEN: string;
};
