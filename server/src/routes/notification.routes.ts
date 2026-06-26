import { Router } from 'express';
import { auth } from '../middlewares/auth';
import { getNotifications, markAllRead, markRead } from '../controllers/notification.controller';

const router = Router();

router.get('/', auth, getNotifications);
router.put('/read-all', auth, markAllRead);
router.put('/:id/read', auth, markRead);

export default router;
