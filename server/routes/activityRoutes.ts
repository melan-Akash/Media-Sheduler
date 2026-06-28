import express from 'express';
import { getActivity } from '../controllers/activityController';
import { protect } from '../middlewares/authMiddleware';

const activityRouter = express.Router();

activityRouter.get('/', protect, getActivity);

export default activityRouter;