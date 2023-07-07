import { Request, Response, Router } from 'express';

const router = Router();

router.get('/:id', function getBook(req: Request, res: Response) {
    // TODO: implement functionality
    return res.status(500).json({
        error: 'server_error',
        error_description: 'Endpoint not implemented yet.',
    });
});

router.post('/', function createBook(req: Request, res: Response) {
    // TODO: implement functionality
    return res.status(500).json({
        error: 'server_error',
        error_description: 'Endpoint not implemented yet.',
    });
});

export default router;
