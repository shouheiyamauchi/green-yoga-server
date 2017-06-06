const lessonController = require('../../../controllers/lessonController')
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
router.get('/', lessonController.getLessons);

// create a new class
router.post('/', [authCheck, teacherCheck], lessonController.postLesson);

// get a class
router.get('/:id', [authCheck, administratorCheck], lessonController.getLesson);

// edit a class
router.post('/:id', [authCheck, administratorCheck], lessonController.updateLesson);

// delete a class
router.delete('/:id', [authCheck, administratorCheck], lessonController.deleteLesson);

module.exports = router;
