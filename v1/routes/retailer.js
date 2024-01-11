const router = require("express").Router();
const controllers = require('../controllers');

router.post("/", controllers.retailer.create);
router.get("/", controllers.retailer.getAll);
router.get("/:id", controllers.retailer.getById);
router.put("/:id", controllers.retailer.updateById);
module.exports = router;
