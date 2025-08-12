"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSession = createSession;
const jwt_1 = require("./jwt");
function createSession(user) {
    const token = (0, jwt_1.signJwt)({ userId: user.id, role: user.role });
    return { token, expiresIn: '7d' };
}
