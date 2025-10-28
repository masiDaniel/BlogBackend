const express = require("express");
const router  = express.Router();
const {authController} = require("../controllers");
const {signUpValidator, signInValidator, emailValidator, verifyUserValidator, recoverPasswordValidator, changePasswordValidator, updateProfileValidator} = require("../validators/auth")
const validate = require("../validators/validate")
const isAuth = require("../middlewares/isAuth");

router.post("/signup", signUpValidator, validate, authController.signup)
router.post("/signin", signInValidator, validate, authController.signin)
router.post("/send-verification-email",emailValidator, validate, authController.verifyCode)
router.post("/verify-user",verifyUserValidator, validate, authController.verifyUser)
router.post("/forget-password-code",emailValidator, validate, authController.forgetPasswordCode)
router.post("/recover-password",recoverPasswordValidator, validate, authController.recoverPassword)

router.put("/change-password", changePasswordValidator, validate ,isAuth, authController.changePassword)

router.put("/update-profile", updateProfileValidator, validate ,isAuth, authController.updateProfle)

module.exports = router;