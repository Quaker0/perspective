import { Request, Response, NextFunction } from 'express';

export default function errorHandler(
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction,
) {
    req.context.logger.error('Unknown error occurred:', error);
    return res
        .status(500)
        .json({ status: 'Failed', error: 'Internal Server Error', traceId: req.context.traceId });
}
