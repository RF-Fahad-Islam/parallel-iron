import config from '../../config';
import type { Request, Response, NextFunction } from 'express';

export function isLoggedIn(req: Request, res: Response, next: NextFunction): void {
    if (req.isAuthenticated()) return next();
    res.status(401).json({ error: 'Unauthorized', message: 'Please Login!' });
}

export function isAdmin(req: Request, res: Response, next: NextFunction): void {
    if (req.isAuthenticated()) {
        req.user!.getRoles().then((roles) => {
            if (roles.includes('admin')) {
                next();
            } else {
                res.status(401).json({ error: 'Unauthorized', message: 'Please Login!' });
            }
        });
    } else {
        res.status(401).json({ error: 'Unauthorized', message: 'Please Login!' });
    }
}

export function isAdminOrToken(req: Request, res: Response, next: NextFunction): void {
    const authHeader = req.get('authorization');
    if (authHeader) {
        const token = authHeader.split(' ').pop();
        if (token === config!.admin?.token) {
            return next();
        }
        res.status(200).json({ error: { error: 'Unauthorized', message: 'Invalid Token!' } });
    } else {
        return isAdmin(req, res, next);
    }
}

export function isLoggedInWithOk(req: Request, res: Response, next: NextFunction): void {
    if (req.isAuthenticated()) return next();
    res.status(200).json({ error: { error: 'Unauthorized', message: 'Please Login!' } });
}
