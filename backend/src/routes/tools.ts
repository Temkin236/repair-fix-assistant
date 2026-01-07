import { Router } from 'express';
// import tools logic here

const router = Router();

router.get('/ifixit', (req, res) => {
  // TODO: implement iFixit integration
  res.json({ message: 'iFixit endpoint' });
});

router.get('/gemini', (req, res) => {
  // TODO: implement Gemini integration
  res.json({ message: 'Gemini endpoint' });
});

export default router;
