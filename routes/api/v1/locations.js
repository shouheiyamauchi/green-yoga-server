const locationController = require('../../../controllers/locationController')
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
router.get('/', locationController.getLocations);

// create a new class type
router.post('/', [authCheck, administratorCheck], locationController.postLocation);

// get a class type
router.get('/:id', [authCheck, administratorCheck], locationController.getLocation);

// edit a class type
router.post('/:id', [authCheck, administratorCheck], locationController.updateLocation);

// delete a class type
router.delete('/:id', [authCheck, administratorCheck], locationController.deleteLocation);

module.exports = router;
