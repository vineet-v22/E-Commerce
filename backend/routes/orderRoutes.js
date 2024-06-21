const express = require("express")
const router = express.Router();
const { isAuthenticatedUser, authorizedRoles } = require("../middleware/auth")
const { newOrder, myOrders, getSingleOrder, getAllOrders, updateOrder, deleteOrder } = require("../controllers/orderControllers");

router.route("/order/new").post(isAuthenticatedUser,newOrder);

router.route("/orders/me").get(isAuthenticatedUser, myOrders);

router.route("/orders/:id").get(isAuthenticatedUser, getSingleOrder);//                                           ^ comma added here                ^ closing parenthesis added

router.route("/admin/orders").get(isAuthenticatedUser,authorizedRoles("admin"),getAllOrders);

router.route("/admin/orders/:id").put(isAuthenticatedUser,authorizedRoles("admin"),updateOrder).delete(isAuthenticatedUser,
    authorizedRoles("admin"),deleteOrder
);


module.exports = router;