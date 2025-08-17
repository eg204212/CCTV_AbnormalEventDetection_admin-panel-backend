const express = require('express');
const router = express.Router();
const {
    createAttribute,
    getAllAttributes,
    getAttribute,
    updateAttribute,
    deleteAttribute
} = require('../controllers/productAttributeController');

// Product Attribute routes
router.post('/', createAttribute);
router.get('/', getAllAttributes);
router.get('/:id', getAttribute);
router.put('/:id', updateAttribute);
router.delete('/:id', deleteAttribute);

module.exports = router;