import * as express from 'express';
import { isAuthenticated } from "../middleware/auth.middleware";


const logoutRouter = express.Router();

logoutRouter.post('/logout', isAuthenticated, (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.status(500).send('Could not log out.');
    } else {
      res.clearCookie('connect.sid'); // Replace 'connect.sid' with your session cookie name if different
      res.send('Logged out');
    }
  });
});

export default logoutRouter;