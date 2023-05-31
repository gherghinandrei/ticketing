import { currentUser } from '@ghergtickets/common';
import express from 'express';
// import { requireAuth } from '../middlewares/require-auth';



const router = express.Router();

router.get('/api/users/currentuser', currentUser, (req, res) => {
  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
