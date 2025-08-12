import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './user/controller';
import nftRoutes from './nft/controller';
import agtokenRoutes from './token/agtoken';
import tabascoRoutes from './token/tabasco';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes API principales
app.use('/api/user', userRoutes);
app.use('/api/nft', nftRoutes);
app.use('/api/token/agt', agtokenRoutes);
app.use('/api/token/tabascoin', tabascoRoutes);

// Route de test
app.get('/', (req, res) => res.send('API Artgold Backend OK'));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Backend lancé sur http://localhost:${PORT}`);
});