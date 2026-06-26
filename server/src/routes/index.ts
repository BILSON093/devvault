import { Router } from 'express';
import userRoutes from './user.routes';
import resourceRoutes from './resource.routes';
import collectionRoutes from './collection.routes';
import pathRoutes from './path.routes';
import tagRoutes from './tag.routes';
import searchRoutes from './search.routes';
import notificationRoutes from './notification.routes';
import parseRoutes from './parse.routes';
import statsRoutes from './stats.routes';

const router = Router();

router.use('/auth', userRoutes);
router.use('/resources', resourceRoutes);
router.use('/collections', collectionRoutes);
router.use('/paths', pathRoutes);
router.use('/tags', tagRoutes);
router.use('/search', searchRoutes);
router.use('/notifications', notificationRoutes);
router.use('/parse', parseRoutes);
router.use('/stats', statsRoutes);

export default router;
