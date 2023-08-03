const express = require('express');
const router = express.Router()

const sharedUser = require("../api_operations/shared/shared");



/**
 * User Registration
 */

router.route("/registerUser").post(sharedUser.user_registration.register);
router.route("/loginUser").post(sharedUser.user_registration.login);


module.exports = router;