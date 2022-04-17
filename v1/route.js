const express = require('express');
const Routes = require('./routes/');
const router = express();
router.use('/admin', Routes.admin);
router.use('/customer', Routes.customer);
// router.use('/driver', Routes.driver);
module.exports = router;