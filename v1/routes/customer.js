const router = require("express").Router();
const controllers = require('../controllers');
/*
On-Boarding
*/
router.post("/request", controllers.customer.request);
module.exports = router