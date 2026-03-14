import { Request, Response, NextFunction } from 'express';

export function requiredFields(...fields: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        const missing = fields.filter(f => !req.body[f]);
        if (missing.length > 0) {
            return res.status(400).json({ 
                error: `Missing required fields: ${missing.join(", ")}` 
            });
        }
        next();
    };
}