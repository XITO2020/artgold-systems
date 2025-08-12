"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middleware_1 = require("../auth/middleware");
const service_1 = require("./service");
const validators_1 = require("./validators");
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
router.post('/upload', middleware_1.authenticateToken, validators_1.validateUploadNft, async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });
    return (0, service_1.uploadNft)(req, res);
});
router.post('/buy/:nftId', middleware_1.authenticateToken, service_1.buyNft);
router.post('/sell/:nftId', middleware_1.authenticateToken, service_1.sellNft);
router.get('/library', middleware_1.authenticateToken, service_1.getUserNfts);
exports.default = router;
