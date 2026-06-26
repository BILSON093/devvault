import { Router } from 'express';
import { auth } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { parseLimiter } from '../middlewares/rateLimiter';
import { parseUrlSchema } from '../utils/validator';
import { parseUrl } from '../controllers/parse.controller';

const router = Router();

router.post('/url', auth, parseLimiter, validate(parseUrlSchema), parseUrl);

export default router;
