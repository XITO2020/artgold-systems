// À étendre si besoin pour Joi/Zod validation côté backend
export const allowedMediaTypes = ['IMAGE', 'VIDEO', 'AUDIO', 'THREED'];

import { body } from 'express-validator';

export const validateUploadNft = [
  body('title')
    .notEmpty()
    .withMessage('Le titre est obligatoire')
    .isString()
    .withMessage('Le titre doit être une chaîne de caractères'),

  body('mediaUrl')
    .notEmpty()
    .withMessage('L’URL du média est requise')
    .isURL()
    .withMessage('L’URL du média n’est pas valide'),

  body('mediaType')
    .notEmpty()
    .withMessage('Le type de média est requis')
    .isIn(['image', 'video'])
    .withMessage('Type de média non supporté'),

  body('categoryId')
    .notEmpty()
    .withMessage('La catégorie est requise')
    .isString()
    .withMessage('ID de catégorie invalide'),
];
