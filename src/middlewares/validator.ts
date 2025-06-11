import { type Request, type Response, type NextFunction } from 'express';
import { ZodError, type AnyZodObject } from 'zod';

export const validate =
    (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        } catch (e) {
            if (e instanceof ZodError) {
                return res.status(400).json({
                    status: 'Failed',
                    error: e.errors?.[0]?.message,
                    traceId: req.context.traceId,
                });
            }
            return res.status(500).json({
                status: 'Failed',
                error: 'Internal Server Error',
                traceId: req.context.traceId,
            });
        }
    };
