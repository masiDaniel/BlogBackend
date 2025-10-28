const {User} = require("../models");
const comparePassword = require("../utils/comparePassword");
const hashPassword = require("../utils/haspassward");
const generateToken = require("../utils/generateToken");
const generateCode = require("../utils/generateCode");
const sendEmail = require("../utils/sendEmail");

const signup = async (req, res, next) => {
try {
    const {name, email, password, role} = req.body;
    // if (!name){
    //     const err = new Error("Name is required");
    //     err.statusCode = 400; 
    //     throw err;
    // }
    //  if (!email){
    //       const err = new Error("email is required");
    //     err.statusCode = 400; 
    //     throw err;
    // }

    //  if (!password){
    //      const err = new Error("password is required");
    //     err.statusCode = 400; 
    //     throw err;
    // }

    //  if (password.length < 6){
    //     const err = new Error("Password should be 6 character long");
    //     err.statusCode = 400; 
    //     throw err;
    // }

    const isEmailExist  = await User.findOne({email});
    if (isEmailExist){
        res.code - 400;
        throw new Error("email already exists")
    }
   const hashedPassword = await hashPassword(password)
    const newUser = new User({name, email, password: hashedPassword, role});
    await newUser.save();

    res.status(201).json({code: 201, status: true, message: "user registered succesfully" });
} catch (error) {
    next(error)
}
}
const signin = async (req, res, next) => {
    try {
        const {email,  password} =  req.body;
        const user = await User.findOne({email});

        if(!user){
            res.code = 401;
            throw new Error("invalid credentials ")
        }
        const match = await comparePassword(password, user.password);
        if (!match){
            res.code = 401;
            throw new Error("invalid credentials ")
        }

        const token = generateToken(user);
        res.status(200).json({code: 200, status: true, message: "user signed in successfully", data: {token}});

    }catch(error){
        next(error)
    }
}
const verifyCode = async (req, res, next) => {

    try{
        const {email} = req.body;

        const user = await User.findOne({ email });

        if(!user){
            res.code = 404;
            throw new Error("user not found");
        }

        if(user.isVerified){
            res.code = 400;
            throw new Error("User already verified");
        }

        const code = generateCode(6);
        user.verificationCode = code;
        await user.save();
        console.log("email", user.email)

        //send email
        await sendEmail(
            user.email,
            "email verification code",
            code,
            "verify your account"
        );


        res.status(200).json({code: 200, status: true, message: "user verification code sent succesfully"})


    }catch(error){
        next(error);
    }
}
const verifyUser = async (req, res, next) => {
    try{
        const {email, code } = req.body;

        const user = await User.findOne({email});

        if(!user){
            res.code = 404;
            throw new Error("User not found ")
        }

         if(user.verificationCode !== code){
            res.code = 400;
            throw new Error("Invalid code ")
        }

        user.isVerified = true;
        user.verificationCode = null

        await user.save();

        res.status(200).json({code :200,  status: true, message: "user verified succesfully"});

    }catch(error){
        next(error);
    }
}
const forgetPasswordCode = async(req, res, next) =>{
    try {
        const {email} = req.body;
        const user = await User.findOne({email})

        if(!user){
            res.code = 404;
            throw new Error("User not found ")
        }

        const code = generateCode(6);
        user.forgetPasswordCode = code ;

        await user.save();

         await sendEmail(
            user.email,
            "forgot password code",
            code,
            "change your password"
        );

        res.status(200).json({code :200,  status: true, message: "Forgot password coe sent succesfully"});
    }catch(error){
        next(error);
    }
}
const recoverPassword = async(req, res, next) => {
    try{
        const {email, code, password} = req.body;

        const user = await User.findOne({email})

        if(!user){
            res.code = 404;
            throw new Error("User not found ")
        }

        if(user.forgetPasswordCode !== code){
            res.code = 400;
            throw new Error("Invalid code")
        }

        const hashedPassword = await hashPassword(password);

        user.password = hashedPassword;
        user.forgetPasswordCode = null;

        await user.save();

        res.status(200).json({code :200,  status: true, message: "password recovered succesfully"});

    }catch(error){
        next(error);
    }
}
const changePassword = async(req, res, next) =>{
    try{
        const {oldPassword, newPassword} = req.body;
        const {_id} = req.user;

        const user = await User.findById(_id);

        if(!user){
            res.code = 404;
            throw new Error("User not found ")
        }

        const match = await comparePassword(oldPassword, user.password);

        if (!match) {
            res.code = 400;
            throw new Error("Old password does not match")
        }

         if (oldPassword === newPassword) {
            res.code = 400;
            throw new Error("You are providing the old password")
        }

        const hashedPassword = await hashPassword(newPassword);
        user.password = hashedPassword;

        await user.save();

         res.status(200).json({code :200,  status: true, message: "password changed succesfully"});

    }catch(error){
        next(error);
    }

}
const updateProfle = async(req, res, next) => {
    try{
        const {_id} = req.user;
        const {name, email} = req.body;

        const user = await User.findById(_id).select("-password -verificationCode -forgetPasswordCode");
        if(!user){
            res.code = 404;
            throw new Error("user not found");
        }

        if (email) {
            const ifUserExists = await User.findOne({email}); 
            if (ifUserExists && ifUserExists.email === email && String(user._id) !== String(ifUserExists._id)){
                res.code = 400;
                throw new Error("email already exists");
            }

        }

        user.name = name ? name : user.name;
        user.email = email ? email : user.email;


        if(email){
            user.isVerified = false
        }

        await user.save()

        res.status(200).json({code: 200, status: true, message: "user profile updated succesfully", data: {user}});

    }catch(error){
        next(error);
    }
}
module.exports = {signup, signin, verifyCode, verifyUser, forgetPasswordCode, recoverPassword, changePassword, updateProfle};