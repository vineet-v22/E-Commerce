const Product = require("../models/productModels");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");


/// create product -- Admin

exports.createProduct = catchAsyncErrors(async(req,res,next)=>{

    req.body.user = req.user.id;


    const product = await Product.create(req.body);

    res.status(201).json({
        success:true,
        product
    });
});

//get All products

exports.getAllProducts = catchAsyncErrors(async(req,res)=>{

    const resultPerPage = 5;
    const productCount = await Product.countDocuments();

    const apiFeature = new ApiFeatures(Product.find(),req.query)
    .Search()
    .filter().pagination(resultPerPage);
    const products = await apiFeature.query;
    res.status(200).json({
        success:true,
        products });
});

// Get Product details
exports.getProductDetails = catchAsyncErrors(async(req,res,next)=>{
    const product = await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHandler("Product not found",404));
    }

    const productCount = await Product.countDocuments(); // Fetch the count of products

    res.status(200).json({
        success:true,
        product,
        productCount  // Include productCount in the response
    });
});


//update product -- Admin

exports.updataProduct = catchAsyncErrors(async(req,res,next)=>{
    let product =await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHandler("Product not found",404));
    }
    product = await Product.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    });
    res.status(200).json({
        success:true,
        product
    });
});

// Delete Product

exports.deleteProduct = catchAsyncErrors(async(req,res,next)=>{
    const product = await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHandler("Product not found",404));
    }
    await product.deleteOne();

    res.status(200).json({
        success:true,
        message:"Product Deleted Succesfully"
    });
});

// Create New review or update the review

exports.createProductReview = catchAsyncErrors(async(req,res,next) =>{
    const{rating,comment,productId} = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment,
    };
    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find((rev) => rev.user.toString() === req.user._id.toString());

    if (isReviewed) {
        product.reviews.forEach((rev) => {
            if (rev.user.toString() === req.user._id.toString()) {
                rev.rating = rating;
                rev.comment = comment;
            }
        });
    } else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    let totalRating = 0;
    product.reviews.forEach((rev) => {
        totalRating += rev.rating;
    });

    product.ratings = totalRating / product.reviews.length;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
    });
});


// Get all reviews of a product

exports.getProductReviews = catchAsyncErrors(async(req,res,next)=>{
    const product = await Product.findById(req.query.id);
    if(!product){
        return next(new ErrorHandler("Product not found",404));
    }
    res.status(200).json({
        success:true,
        reviews:product.reviews,
    });
});

// Delete Reviews

exports.deleteReview = catchAsyncErrors(async(req, res, next) => {
    try {
        const product = await Product.findById(req.query.productId);
        // console.log(product);
        
        if (!product) {
            return next(new ErrorHandler("Product not found", 404));
        }
        
        const reviews = product.reviews.filter((rev) => rev._id.toString() !== req.query.id.toString());
        
        let totalRating = 0;
        reviews.forEach((rev) => {
            totalRating += rev.rating;
        });

        const ratings = reviews.length > 0 ? totalRating / reviews.length : 0;

        const numOfReviews = reviews.length;

        await Product.findByIdAndUpdate(req.query.productId, {
            reviews,
            ratings,
            numOfReviews
        }, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        });

        // console.log(updatedProduct);
        
        res.status(200).json({
            success: true,
        });
    } catch (error) {
        return next(error); // Pass any caught errors to the error handling middleware
    }
});
