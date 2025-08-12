"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserByEmail = getUserByEmail;
exports.createUser = createUser;
exports.validateUser = validateUser;
const bcrypt_1 = __importDefault(require("bcrypt"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function getUserByEmail(email) {
    return prisma.user.findUnique({ where: { email } });
}
async function createUser(data) {
    const hashedPassword = await bcrypt_1.default.hash(data.password, 10);
    return prisma.user.create({
        data: {
            email: data.email,
            username: data.username,
            password: hashedPassword,
            role: 'user',
        },
    });
}
async function validateUser(email, password) {
    const user = await getUserByEmail(email);
    if (!user)
        return null;
    const match = await bcrypt_1.default.compare(password, user.password);
    if (!match)
        return null;
    return user;
}
