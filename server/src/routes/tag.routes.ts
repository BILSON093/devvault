import { Router } from 'express';
import { optionalAuth } from '../middlewares/auth';
import { getTags, getTagResources } from '../controllers/tag.controller';

const router = Router();

router.get('/', getTags);
router.get('/:id/resources', optionalAuth, getTagResources);

export default router;
