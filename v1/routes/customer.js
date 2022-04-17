const router = require("express").Router();
const controllers = require('../controllers');
const validations = require('../validations')
const service = require('../services')
/*
On-Boarding
*/
router.post("/signup", controllers.customer.signUp);
router.post("/login", controllers.customer.login);
router.post("/verify/email", validations.customer.isCustomerValid, controllers.customer.verifyEmail);
router.post("/verify/otp/:type", async (req, res, next) => {
    if (req.params.type != "forgot") validations.customer.isCustomerValid(req, res, next)
    else next()
}, controllers.customer.verifyOtp);
router.post("/resend/otp/:type", async (req, res, next) => {
    if (req.params.type != "forgot") validations.customer.isCustomerValid(req, res, next)
    else next()
}, controllers.customer.resendOtp);
router.post("/forgot/password", controllers.customer.forgotPassword);
router.post("/reset/password", validations.customer.isCustomerValid, controllers.customer.resetPassword);
router.post("/change/password", validations.customer.isCustomerValid, controllers.customer.changePassword);
router.post("/complete/profile", validations.customer.isCustomerValid, service.upload.CustomerProfilePicUpload.single('profilePic'), controllers.customer.completeProfile);
router.post("/logout", validations.customer.isCustomerValid, controllers.customer.logout);
/*
CRUDs
*/
router.get("/profile", validations.customer.isCustomerValid, controllers.customer.getProfile);
router.put("/profile", validations.customer.isCustomerValid, service.upload.CustomerProfilePicUpload.single('profilePic'), controllers.customer.editProfile);
/*
Home
*/
router.get("/home", validations.customer.isCustomerValid, controllers.customer.home)
router.get("/products", validations.customer.isCustomerValid, controllers.customer.getProducts)
/*
DropDowns
*/
router.get("/dropdowns/:type", validations.customer.isCustomerValid, controllers.driver.dropDowns)
/*
Cards
*/
router.get("/card", validations.customer.isCustomerValid, controllers.customer.viewCard)
router.post("/card", validations.customer.isCustomerValid, controllers.customer.addCard)
router.put("/card", validations.customer.isCustomerValid, controllers.customer.updateCard)
router.delete("/card", validations.customer.isCustomerValid, controllers.customer.deleteCard)
/*
DeliveryAddresses
*/
router.get("/addresses/", validations.customer.isCustomerValid, controllers.customer.getDeliveryAddresses)
router.post("/addresses/", validations.customer.isCustomerValid, controllers.customer.addDeliveryAddresses)
router.delete("/addresses/", validations.customer.isCustomerValid, controllers.customer.deleteDeliveryAddresses)
router.put("/addresses/", validations.customer.isCustomerValid, controllers.customer.updateDeliveryAddresses)
/*
Contact Us
*/
router.post("/contact/", validations.customer.isCustomerValid, controllers.customer.contactUs)
/*
Booking
*/
router.post("/booking", validations.customer.isCustomerValid, controllers.customer.createBooking);
router.get("/booking/:type", validations.customer.isCustomerValid, controllers.customer.getBooking);
router.put("/booking", validations.customer.isCustomerValid, controllers.customer.cancelBooking);
router.get("/booking/detail/:bookingId", validations.customer.isCustomerValid, controllers.customer.getBookingDetail);
/*
Notifications
*/
router.get("/notifications", validations.customer.isCustomerValid, controllers.customer.getNotifications);
/*
Wallet
*/
router.put("/wallet", validations.customer.isCustomerValid, controllers.customer.addToWallet);
router.get("/transactions", validations.customer.isCustomerValid, controllers.customer.getTransaction);
/**
 * Promo
 */
 router.get("/promo", validations.customer.isCustomerValid, controllers.admin.getAllPromo);
module.exports = router