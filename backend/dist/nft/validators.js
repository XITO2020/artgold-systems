"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUploadNft = exports.allowedMediaTypes = void 0;
// À étendre si besoin pour Joi/Zod validation côté backend
exports.allowedMediaTypes = ['IMAGE', 'VIDEO', 'AUDIO', 'THREED'];
const express_validator_1 = require("express-validator");
exports.validateUploadNft = [
    (0, express_validator_1.body)('title')
        .notEmpty()
        .withMessage('Le titre est obligatoire')
        .isString()
        .withMessage('Le titre doit être une chaîne de caractères'),
    (0, express_validator_1.body)('mediaUrl')
        .notEmpty()
        .withMessage('L’URL du média est requise')
        .isURL()
        .withMessage('L’URL du média n’est pas valide'),
    (0, express_validator_1.body)('mediaType')
        .notEmpty()
        .withMessage('Le type de média est requis')
        .isIn(['image', 'video'])
        .withMessage('Type de média non supporté'),
    (0, express_validator_1.body)('categoryId')
        .notEmpty()
        .withMessage('La catégorie est requise')
        .isString()
        .withMessage('ID de catégorie invalide'),
];
