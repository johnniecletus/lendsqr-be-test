import { Request, Response, NextFunction } from "express";
export type AuthedRequest = Request & {
    auth?: {
        userId: string;
        email: string;
    };
};
export declare function authMiddleware(req: AuthedRequest, _res: Response, next: NextFunction): void;
