import { NextFunction, Request, Response } from "express";
import { ZodTypeAny } from "zod";
export declare function asyncHandler<T extends Request>(fn: (req: T, res: Response, next: NextFunction) => Promise<void>): (req: T, res: Response, next: NextFunction) => void;
export declare function validate(schema: ZodTypeAny, location?: "body" | "params" | "query"): (req: Request, _res: Response, next: NextFunction) => void;
export declare function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction): void;
