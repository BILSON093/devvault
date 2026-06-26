import { Router } from 'express';
import { auth } from '../middlewares/auth';
import {
  getOverview,
  getTypeDistribution,
  getTagRanking,
  getActivityHeatmap,
} from '../controllers/stats.controller';

const router = Router();

router.get('/overview', auth, getOverview);
router.get('/type-distribution', auth, getTypeDistribution);
router.get('/tag-ranking', auth, getTagRanking);
router.get('/activity-heatmap', auth, getActivityHeatmap);

export default router;
