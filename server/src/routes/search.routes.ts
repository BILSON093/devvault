import { Router } from 'express';
import { auth } from '../middlewares/auth';
import { search, getHotSearches, getSearchHistory } from '../controllers/search.controller';

const router = Router();

router.get('/', auth, search);
router.get('/hot', getHotSearches);
router.get('/history', auth, getSearchHistory);

export default router;
