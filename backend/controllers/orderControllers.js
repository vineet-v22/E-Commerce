const Order = require("../models/orderModel")
const Product = require("../models/productModels");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

// Create New Order
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
    const { shippingInfo, orderItems, paymentInfo, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,     
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id,
    });

    res.status(201).json({
        success: true,
        order,
    });
});

// get Single Order
exports.getSingleOrder = catchAsyncErrors(async(req,res,next) =>{
    const order = await Order.findById(req.params.id).populate(
        "user",
        "name email"
    );
    if(!order){
        return next(new ErrorHandler("Order not found by this Id",404));
    }

    res.status(200).json({
        success: true,
        order,
    });
});

// get logged in user orders 
exports.myOrders = catchAsyncErrors(async(req,res,next)=>{

    const orders = await Order.find({user: req.user._id});

    res.status(200).json({
        success: true,
        orders,
    });
});

// get all orders -- Admin
let totalAmount = 0;
exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find();
    orders.forEach((order) => {
        totalAmount += order.paymentInfo.totalPrice;
    });

    res.status(200).json({
        success: true,
        totalAmount,
        orders,
    });
});


// update order status --
// Update order status
exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorHandler("Order not found with this ID", 404));
    }

    if (order.orderStatus === "Delivered") {
        return next(new ErrorHandler("You have already delivered this product", 400));
    }

    order.orderItems.forEach(async (item) => {
        await updateStock(item.product, item.quantity);
    });

    order.orderStatus = req.body.status;

    if (req.body.status === "Delivered") {
        order.deliveredAt = Date.now();
    }

    await order.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
    });
});

async function updateStock(id, quantity) {
    const product = await Product.findById(id);

    if (!product) {
        throw new ErrorHandler("Product not found", 404);
    }

    product.stock -= quantity;
    await product.save({ validateBeforeSave: false });
}

// delete order -- Admin
exports.deleteOrder = catchAsyncErrors(async(req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorHandler("Order not found with this ID", 404));
    }

    await order.deleteOne();  // Using deleteOne method on the document
    res.status(200).json({
        success: true,
    });
});
