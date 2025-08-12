"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
let prisma;
if (!global.globalPrisma) {
    global.globalPrisma = new client_1.PrismaClient();
}
prisma = global.globalPrisma;
exports.default = prisma;
