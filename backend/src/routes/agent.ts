import { Router } from 'express';
// import agent logic here

const router = Router();

router.post('/run', (req, res) => {
  // TODO: implement agent run logic
  res.json({ message: 'Agent run endpoint' });
});

export default router;
