const classController = require('../../../controllers/classController')
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

// get full list of class
router.get('/', classController.getClasses);

// create a new class
router.post('/', [authCheck, teacherCheck], classController.postClass);

// get a class
router.get('/:id', [authCheck, administratorCheck], classController.getClass);

// edit a class
router.post('/:id', [authCheck, administratorCheck], classController.updateClass);

// delete a class
router.delete('/:id', [authCheck, administratorCheck], classController.deleteClass);

module.exports = router;
