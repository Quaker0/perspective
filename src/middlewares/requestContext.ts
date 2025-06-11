import { randomUUID } from 'crypto';
import { NextFunction, Request, Response } from 'express';

export interface RequestContext {
    traceId: string;
    logger: {
        info: (...args: any[]) => void;
        error: (...args: any[]) => void;
    };
}
declare global {
    namespace Express {
        interface Request {
            context?: RequestContext;
        }
    }
}

export function requestContext(req: Request, res: Response, next: NextFunction) {
    const traceId = randomUUID();
    const logger = {
        info: (...args: any[]) => console.log(`[${traceId}]`, ...args),
        error: (...args: any[]) => console.error(`[${traceId}]`, ...args),
    };

    req.context = { traceId, logger };
    res.setHeader('X-Trace-Id', traceId);
    next();
}
