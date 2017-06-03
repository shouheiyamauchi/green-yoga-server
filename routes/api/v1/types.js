const typeController = require('../../../controllers/typeController')
const express = require('express');
const router = new express.Router();

const app = express();

// ensure user is authenticated
const authCheck = require('../../../middleware/auth-check');
// middleware to prevent access to administrator area
const administratorCheck = require('../../../middleware/administrator-check');
// middleware to prevent access to teacher area
const teacherCheck = require('../../../middleware/teacher-check');
// middleware to prevent access to receptionist area
const receptionistCheck = require('../../../middleware/receptionist-check');

// get full list of class types
router.get('/', typeController.getTypes);

// create a new class type
router.post('/', [authCheck, administratorCheck], typeController.postType);

// delete a class type
router.delete('/:id', [authCheck, administratorCheck], typeController.deleteType);

module.exports = router;
