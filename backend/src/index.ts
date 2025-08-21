
import prisma from './lib/prisma';
//infra web
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import helmet from 'helmet';
//securité
import { authenticate, requireAuth } from './auth/middleware';

//routes "fonctionnelles"
import userRoutes from './user/controller';
import nftRoutes from './nft/controller';
import agtokenRoutes from './token/agtoken';
import tabascoRoutes from './token/tabascoin';
// ➕ nouvelles routes
import { authRouter } from './auth/routes';
import { walletRouter } from './wallet/routes';
import artworksRouter from './artworks/controller';
import usersRouter from './users/controller';
import transactionsRouter from './transactions/controller';
import portfolioRouter from './portfolio/controller';
import categoriesRouter from './categories/controller';
import contentValidationsRouter from './content-validations/controller';
// Dashboard
import { collectMetrics, renderDashboardHtml } from './metrics';

dotenv.config(); // 1 charge .env: jwt_secret , database_url

const app = express(); //2 crée serveur

//3 infra web
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));
app.use(express.json());
app.use(cookieParser());
app.use(helmet({ contentSecurityPolicy: false }));

//Debug depuis middleware
app.get("/whoami", authenticate, (req, res) => res.json({ user: req.user ?? null }));

//4 Montage des routes API existantes
app.use('/api/user', userRoutes);
app.use('/api/nft', authenticate, requireAuth, nftRoutes);
app.use('/api/token/agt', authenticate, requireAuth, agtokenRoutes);
app.use('/api/token/tabascoin', authenticate, requireAuth, tabascoRoutes);
app.use('/api/artworks', authenticate, requireAuth, artworksRouter);
app.use('/api/users', authenticate, requireAuth, usersRouter);
app.use('/api/transactions', authenticate, requireAuth, transactionsRouter);
// Public listing endpoint for portfolio
app.use('/api/portfolio', portfolioRouter);
// Public categories endpoints
app.use('/api/categories', categoriesRouter);
// Protected content validations
app.use('/api/content-validations', authenticate, requireAuth, contentValidationsRouter);

// ➕ Nouvelles routes JWT & Wallet
app.use('/auth', authRouter);
app.use('/wallet',authenticate, requireAuth, walletRouter);

// 5 endpoint JSON si je veux consommer depuis autre chose, par exemple ici mon dashboard
app.get('/metrics.json', async (_req, res) => {
  const m = await collectMetrics();
  res.json(m);
});

app.get("/api/user/me", authenticate, requireAuth, (req, res) => {
  const u = (req as import("./auth/middleware").AuthenticatedRequest).user;
  res.json({ id: u.sub, email: u.email, roles: u.roles });
});

app.get('/', async (_req, res) => {
  const m = await collectMetrics();
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(renderDashboardHtml(m));
});


//6 Lancement serveur
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Backend lancé sur http://localhost:${PORT}`);
});
