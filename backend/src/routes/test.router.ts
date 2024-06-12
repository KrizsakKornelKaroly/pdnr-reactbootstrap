import * as express from 'express';
import { isAdmin, isAuthenticated } from '../middleware/auth.middleware';

const testRouter = express.Router();

testRouter.post('/test', isAuthenticated, (req, res) => {
  console.log('User is authenticated');
  res.send('User is authenticated');
});

export default testRouter;
