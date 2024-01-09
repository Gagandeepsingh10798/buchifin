const router = require("express").Router();
const controllers = require('../controllers');

router.post("/create", controllers.retailer.create);
router.post("/get/all", controllers.retailer.getAll);
router.post("/get/id", controllers.retailer.getById);
router.post("/update/id", controllers.retailer.updateById);
module.exports = router;
