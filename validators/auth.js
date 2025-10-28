const {check} = require("express-validator");
const validateEmail = require("./validateEmail");


const signUpValidator = [
  check("name")
    .notEmpty()
    .withMessage("Name is required"),
    
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email"),

  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password should be at least 6 characters long")
];
const signInValidator = [
  check("email").isEmail().withMessage("invalid email").notEmpty().withMessage("email is required"),
  check("password").notEmpty().withMessage("password is required")
]
const emailValidator = [
  check("email").isEmail().withMessage("invalid email").notEmpty().withMessage("email is required"),
]
const verifyUserValidator = [
 check("email").isEmail().withMessage("invalid email").notEmpty().withMessage("email is required"),
 check("code").notEmpty().withMessage("Code is required"),
]
const recoverPasswordValidator = [
  check("email").isEmail().withMessage("invalid email").notEmpty().withMessage("email is required"),
  check("code").notEmpty().withMessage("Code is required"),
  check("password").isLength({min: 6}).withMessage("password should be 6 chars long").notEmpty().withMessage("password is required")
]
const changePasswordValidator = [
  check("oldPassword").notEmpty().withMessage("Old password is required"),
  check("newPassword").notEmpty().withMessage("New password is required")
]
const updateProfileValidator = [
  check("email").custom(async (email)=> {
    if(email){
      const isValidEmail =validateEmail(email);
      if(!isValidEmail){
        throw "invalid email"
      }
    }
  } )
]


module.exports = {signUpValidator, signInValidator, emailValidator, verifyUserValidator, recoverPasswordValidator, changePasswordValidator, updateProfileValidator}