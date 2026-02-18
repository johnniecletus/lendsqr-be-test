export declare const hashPassword: (value: string) => Promise<string>;
export declare const comparePassword: (value: string, hash: string) => Promise<boolean>;
