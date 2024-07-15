const Product = require("../models/productModels");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");
const cloudinary = require("cloudinary");


/// create product -- Admin

exports.createProduct = catchAsyncErrors(async (req, res, next) => {

    let images = [];
    if (typeof req.body.images === "string") {
        images.push(req.body.images);
    }
    else {
        images = req.body.images;
    }

    const imagesLink = [];

    for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: "products",
        });

        imagesLink.push({
            public_id: result.public_id,
            url: result.secure_url,
        })
    }
    req.body.images = imagesLink;
    req.body.user = req.user.id;


    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        product
    });
});

// Get all products
exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {
    const resultPerPage = 8;
    const productsCount = await Product.countDocuments();

    const apiFeature = new ApiFeatures(Product.find(), req.query)
        .Search()  // Ensure this method is implemented in ApiFeatures
        .filter(); // Ensure this method is implemented in ApiFeatures

    let products = await apiFeature.query;
    let filteredProductsCount = products.length;

    apiFeature.pagination(resultPerPage);
    products = await apiFeature.query.clone();  // Use clone to avoid query re-execution issues

    res.status(200).json({
        success: true,
        products,
        productsCount,
        resultPerPage,
        filteredProductsCount
    });
});

// Get all products
exports.getAdminProducts = catchAsyncErrors(async (req, res, next) => {
    try {
        const products = await Product.find();

        // Log the number of products found
        // console.log(`Found ${products.length} products`);

        // Check if products array is empty
        // if (products.length === 0) {
        //     console.log("No products found in the database");
        // }

        // Log the first few products (for debugging purposes)
        // console.log("Sample products:", products.slice(0, 3));

        res.status(200).json({
            success: true,
            products,
        });
    } catch (error) {
        console.error("Error in getAdminProducts:", error);
        return next(new ErrorHandler("Failed to fetch products", 500));
    }
});

// Get Product details
exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    // const productCount = await Product.countDocuments(); // Fetch the count of products

    res.status(200).json({
        success: true,
        product,
        // productCount  // Include productCount in the response
    });
});


//update product -- Admin

exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    // Images starts here

    let images = [];
    if (typeof req.body.images === "string") {
        images.push(req.body.images);
    }
    else {
        images = req.body.images;
    }

    if (images !== undefined) {

        // Deleting Images from cloudinary

        for (let i = 0; i < product.images.length; i++) {
            await cloudinary.v2.uploader.destroy(product.images[i].public_id);
        }

        const imagesLink = [];

        for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.v2.uploader.upload(images[i], {
                folder: "products",
            });

            imagesLink.push({
                public_id: result.public_id,
                url: result.secure_url,
            });
        }

        req.body.images = imagesLink;
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });
    res.status(200).json({
        success: true,
        product
    });
});

// Delete Product

exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }


    // Deleting Images from Cloudinary
    for (let i = 0; i < product.images.length; i++) {
        await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }

    await product.deleteOne();

    res.status(200).json({
        success: true,
        message: "Product Deleted Succesfully"
    });
});

// Create New review or update the review

exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
    const { rating, comment, productId } = req.body;

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

exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.id);
    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }
    res.status(200).json({
        success: true,
        reviews: product.reviews,
    });
});

// Delete Reviews

exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
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
