import { Router } from 'express';
import { auth, optionalAuth } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { createCollectionSchema, updateCollectionSchema } from '../utils/validator';
import {
  createCollection,
  getCollections,
  getCollectionById,
  updateCollection,
  deleteCollection,
  addResourceToCollection,
  removeResourceFromCollection,
  forkCollection,
} from '../controllers/collection.controller';

const router = Router();

router.post('/', auth, validate(createCollectionSchema), createCollection);
router.get('/', auth, getCollections);
router.get('/:id', optionalAuth, getCollectionById);
router.put('/:id', auth, validate(updateCollectionSchema), updateCollection);
router.delete('/:id', auth, deleteCollection);

router.post('/:id/resources', auth, addResourceToCollection);
router.delete('/:id/resources/:resourceId', auth, removeResourceFromCollection);
router.post('/:id/fork', auth, forkCollection);

export default router;
