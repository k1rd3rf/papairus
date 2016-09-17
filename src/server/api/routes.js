import express from 'express';
import { router as memberRouter } from './members';

const router = express.Router();

router.use('/members', memberRouter);

export default router;
