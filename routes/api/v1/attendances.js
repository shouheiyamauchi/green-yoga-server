const attendanceController = require('../../../controllers/attendanceController')
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

// get full list of attendance
router.get('/', attendanceController.getAttendances);

// create a new attendance
router.post('/', attendanceController.postAttendance);

// check an attendance exists
router.get('/check', attendanceController.checkAttendance);

// get a attendance
router.get('/:id', attendanceController.getAttendance);

// delete a attendance
router.delete('/:id', attendanceController.deleteAttendance);

module.exports = router;
