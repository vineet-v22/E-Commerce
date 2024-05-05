const ErrorHandler = require("../utils/errorhandler");

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal server error";

    // Wrong MongoDB Id Error
    if (err.name == "CastError") {
        const message = `Resource not found. Invalid: ${err.path}`;
        const error = new ErrorHandler(message, 400);
        return res.status(error.statuscode).json({
            success: false,
            message: error.message,
        });
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
        const error = new ErrorHandler(message, 400);
        return res.status(error.statuscode).json({
            success: false,
            message: error.message,
        });
    }

     // Wrong JWT error
     if (err.name === "JsonWebTokenError") {
        const message = `Json Web token is invalid, Try again`;
        const error = new ErrorHandler(message, 400);
        return res.status(error.statuscode).json({
            success: false,
            message: error.message,
        });
    }

    // JWT EXPIRE ERROR
    if (err.name === "TokenExpiredError") {
        const message = `Json Web token is expired, Try again`;
        const error = new ErrorHandler(message, 400);
        return res.status(error.statuscode).json({
            success: false,
            message: error.message,
        });
    }


    // For other types of errors
    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
};
