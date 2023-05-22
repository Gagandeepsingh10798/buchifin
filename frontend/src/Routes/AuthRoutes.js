import Admin_Login_Screen from "Views/Authentication/Login/index";
import SignUp from "Views/Authentication/SignUp";
import Forgot_Password_Screen from "Views/Authentication/ForgotPassword/index";
import Reset_Password_Screen from "Views/Authentication/ResetPassword/index";
import { ROUTE_CONSTANTS } from "Shared/Routes";
import Add_Trail_Screen from "Views/Authenticated/Add_Trail";
import OTP_Verification from "Views/Authentication/otpVerification";

export const AUTH_ROUTES = [
  {
    path: ROUTE_CONSTANTS.LOGIN,
    component: Admin_Login_Screen,
    title: "Login",
  },
  {
    path: ROUTE_CONSTANTS.FORGOT_PASSWORD,
    component: Forgot_Password_Screen,
    title: "Forgot Password",
  },
  {
    path: ROUTE_CONSTANTS.RESET_PASSWORD,
    component: Reset_Password_Screen,
    title: "Reset Password",
  },
  {
    path :ROUTE_CONSTANTS.OTP_VERIFICATION,
    component: OTP_Verification,
    title: "Otp Verification"
  }
 
];
