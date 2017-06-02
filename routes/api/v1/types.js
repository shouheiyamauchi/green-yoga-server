const typeController = require('../../../controllers/typeController')
const express = require('express');
const router = new express.Router();

router.get('/types', typeController.getTypes);

router.post('/types', typeController.postTypes);

module.exports = router;
