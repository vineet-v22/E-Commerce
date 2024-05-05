const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const crypto = require("crypto");
const User = require("../models/userModels");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");

// Register a user

exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    const { name, email, password } = req.body;
    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: "this is the sample id",
            url: "profilepicUrl",
        },
    });

    sendToken(user, 201, res);
});


// Login User
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    // checking if user has given password and email both
    if (!email || !password) {
        return next(new ErrorHandler("Please Enter Email & Password ", 400))
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }

    sendToken(user, 200, res);
});

// Logout User

exports.logout = catchAsyncErrors(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: "Logged out",
    });
});


// Forgot Password

exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    // Get Reset Password 
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;

    const message = `Your password reset token is :- \n\n${resetPasswordUrl}\n\nIf you have not requested this email
    then please ignore it`;

    try {
        await sendEmail({
            email: user.email,
            subject: `Ecommerce Password Recovery`,
            message,
        });
        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`,
        });

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false })
        return next(new ErrorHandler(error.message, 500));
    }
});

// Reset Password

exports.resetPassword = catchAsyncErrors(async (req, res, next) => {

    // creating token hash
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire : {$gt:Date.now()},
        });

        if (!user) {
            return next(new ErrorHandler("Reset Password Token is Invalid or has been expired", 404));
        }

        if(req.body.password!=req.body.confirmPassword){
            return next(new ErrorHandler("Password does not match password",400));
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

await user.save();
sendToken(user,200,res);

});

// Get User Details

exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {

    const user1 = await User.findById(req.user.id); // Change req.User.id to req.user.id
    res.status(200).json({
        success: true,
        user1,
    });
});

// update user password

exports.updatePassword = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.user.id).select("+password"); // Change req.User.id to req.user.id
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
    if(!isPasswordMatched){
        return next(new ErrorHandler("Old password is incorrect",400));
    }

    if(req.body.newPassword !== req.body.confirmPassword){
        return next(new ErrorHandler("Password didn't match"))
    }
    user.password = req.body.newPassword;

    await user.save();

    sendToken(user,200,res);

});

// update user profile

exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
    const newUserData={
        name:req.body.name,
        email:req.body.email,
    }
    
// we will add cloudenary later
const user = await User.findByIdAndUpdate(req.user.id,newUserData,{
    new:true,
    runValidators:true,
    useFindAndModify:false,
});
    res.status(200).json({
        success:true,
    })
});

// Get All user

exports.getAllUser = catchAsyncErrors(async(req,res,next) => {
    const users = await User.find();

    res.status(200).json({
        success:true,
        users,
    })
})

// Get single Users(admin)

exports.getSingleUser = catchAsyncErrors(async(req,res,next) =>{
    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`User does not exist with id: ${req.params.id}`))
    }

    res.status(200).json({
        success:true,
        user,
    });
});

// update user Role -- Admin

exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
    const newUserData={
        name:req.body.name,
        email:req.body.email,
        role:req.body.role,
    }
    
const user = await User.findByIdAndUpdate(req.user.id,newUserData,{
    new:true,
    runValidators:true,
    useFindAndModify:false,
});
    res.status(200).json({
        success:true,
    });
});

// delete User --Admin

exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    // We will remove cloudenary

    if (!user) {
        return next(new ErrorHandler(`User does not exist with id: ${req.params.id}`));
    }

    await User.deleteOne({ _id: req.params.id }); // Corrected to call remove() method

    res.status(200).json({
        success: true,
        message:"User Deleted Successfully"
    });
});



