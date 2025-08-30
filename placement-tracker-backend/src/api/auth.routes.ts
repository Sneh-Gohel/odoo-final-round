import { Router } from 'express';

const router = Router();


router.get('/', (req, res) => {
    res.send('Auth routes are working.');
});

export default router;