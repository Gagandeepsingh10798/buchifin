const router = require("express").Router();
const controllers = require('../controllers');
/*
On-Boarding
*/
router.post("/login/request", controllers.customer.loginRequest);
router.post("/login", controllers.customer.login);
module.exports = router;