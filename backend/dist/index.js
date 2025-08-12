"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const controller_1 = __importDefault(require("./user/controller"));
const controller_2 = __importDefault(require("./nft/controller"));
const agtoken_1 = __importDefault(require("./token/agtoken"));
const tabasco_1 = __importDefault(require("./token/tabasco"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes API principales
app.use('/api/user', controller_1.default);
app.use('/api/nft', controller_2.default);
app.use('/api/token/agt', agtoken_1.default);
app.use('/api/token/tabascoin', tabasco_1.default);
// Route de test
app.get('/', (req, res) => res.send('API Artgold Backend OK'));
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`🚀 Backend lancé sur http://localhost:${PORT}`);
});
