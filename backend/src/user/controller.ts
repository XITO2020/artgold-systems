import { Router } from 'express';
import { createUser, validateUser, getUserByEmail } from './service';
import { createSession } from '../auth/session';
import { authenticateToken } from '../auth/middleware';

const router = Router();

router.post('/signup', async (req, res) => {
  try {
    const user = await createUser(req.body);
    const session = createSession({ id: user.id, role: user.role });
    res.json({ user, ...session });
  } catch (err) {
    res.status(400).json({ error: 'Inscription échouée', detail: err });
  }
});

router.post('/login', async (req, res) => {
  try {
    const user = await validateUser(req.body.email, req.body.password);
    if (!user) return res.status(401).json({ error: 'Identifiants invalides' });

    const session = createSession({ id: user.id, role: user.role });
    res.json({ user, ...session });
  } catch (err) {
    res.status(400).json({ error: 'Connexion échouée', detail: err });
  }
});

router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await getUserByEmail((req.user as any).userId);
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });

    const { password, ...safeUser } = user;
    res.json(safeUser);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur', detail: err });
  }
});

export default router;
