import { Router } from 'express';
import { createUserWithPassword, validatePasswordLogin } from './service';
import { authenticate, requireAuth } from '../auth/middleware';
import { createSession } from '../auth/session';
import prisma from '../utils/db';


const router = Router();

router.post('/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'missing_fields' });
    const user = await createUserWithPassword({ email, password, name });
    const session = createSession({ id: user.id, isAdmin: user.isAdmin });
    res.json({ user, ...session });
  } catch (err) {
    res.status(400).json({ error: 'Inscription échouée', detail: err });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'email_and_password_required' });
    const user = await validatePasswordLogin(req.body.email, req.body.password);
    if (!user) return res.status(401).json({ error: 'Identifiants invalides' });

    const session = createSession({ id: user.id, isAdmin: user.isAdmin })
    res.json({ user, ...session });
  } catch (err) {
    res.status(400).json({ error: 'Connexion échouée', detail: err });
  }
});

router.get('/me', authenticate, requireAuth, async (req, res) => {
  try {
    const me = req.user!.sub; // typé via middleware
    const user = await prisma.user.findUnique({
      where: { id: me },
      select: {
        id: true, email: true, name: true, image: true,
        isAdmin: true, status: true, discordVerified: true, discordRoles: true
      }
    });
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur', detail: (err as Error).message });
  }
});



export default router;
