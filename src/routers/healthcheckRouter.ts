import { Request, Response, Router } from 'express';

const router = Router();

router.get('/', function check(req: Request, res: Response) {
    return res.status(200).json({ status: 'OK' });
});

export default router;
