const userController = require('../../../controllers/userController')
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

// get full list of users
router.get('/', [authCheck, receptionistCheck], userController.getUsers);

// get a user
router.get('/:id', [authCheck, receptionistCheck], userController.getUser);

// edit a user
router.post('/:id', [authCheck, receptionistCheck], userController.updateUser);

// delete a user
router.delete('/:id', [authCheck, administratorCheck], userController.deleteUser);

module.exports = router;
