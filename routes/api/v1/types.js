const typeController = require('../../../controllers/typeController')
const express = require('express');
const router = new express.Router();

const app = express();

// middleware to prevent access to administrator area
const administratorCheck = require('../../../middleware/administrator-check');

router.get('/types', typeController.getTypes);

router.post('/types', administratorCheck, typeController.postTypes);

module.exports = router;
