import React, { Fragment } from "react";
import CheckoutSteps from "../Cart/CheckoutSteps";
import { useSelector } from "react-redux";
import MetaData from "../layout/MetaData";
import "./ConfirmOrder.css";
import { Link, useNavigate } from "react-router-dom";
import { Typography, Box, Button } from "@mui/material";

const ConfirmOrder = () => {
  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );

  const shippingCharges = subtotal > 1000 ? 0 : 200;

  const tax = subtotal * 0.18;

  const totalPrice = subtotal + tax + shippingCharges;

  const address = `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state}, ${shippingInfo.pinCode}, ${shippingInfo.country}`;

  const proceedToPayment = () => {
    const data = {
      subtotal,
      shippingCharges,
      tax,
      totalPrice,
    };

    sessionStorage.setItem("orderInfo", JSON.stringify(data));

    navigate("/process/payment");
  };

  return (
    <Fragment>
      <MetaData title="Confirm Order" />
      <CheckoutSteps activeStep={1} />
      <div className="confirmOrderPage">
        <Box>
          <Box className="confirmshippingArea">
            <Typography variant="h6">Shipping Info</Typography>
            <Box className="confirmshippingAreaBox">
              <Box>
                <p>Name:</p>
                <span>{user.name}</span>
              </Box>
              <Box>
                <p>Phone:</p>
                <span>{shippingInfo.phoneNo}</span>
              </Box>
              <Box>
                <p>Address:</p>
                <span>{address}</span>
              </Box>
            </Box>
          </Box>
          <Box className="confirmCartItems">
            <Typography variant="h6">Your Cart Items:</Typography>
            <Box className="confirmCartItemsContainer">
              {cartItems &&
                cartItems.map((item) => (
                  <Box key={item.product}>
                    <img src={item.image} alt="Product" />
                    <Link to={`/product/${item.product}`}>
                      {item.name}
                    </Link>{" "}
                    <span>
                      {item.quantity} X ₹{item.price} ={" "}
                      <b>₹{item.price * item.quantity}</b>
                    </span>
                  </Box>
                ))}
            </Box>
          </Box>
        </Box>
        <Box>
          <Box className="orderSummary">
            <Typography variant="h6">Order Summary</Typography>
            <Box>
              <Box>
                <p>Subtotal:</p>
                <span>₹{subtotal}</span>
              </Box>
              <Box>
                <p>Shipping Charges:</p>
                <span>₹{shippingCharges}</span>
              </Box>
              <Box>
                <p>GST:</p>
                <span>₹{tax}</span>
              </Box>
            </Box>

            <Box className="orderSummaryTotal">
              <p>
                <b>Total:</b>
              </p>
              <span>₹{totalPrice}</span>
            </Box>

            <Button variant="contained" color="primary" onClick={proceedToPayment}>
              Proceed To Payment
            </Button>
          </Box>
        </Box>
      </div>
    </Fragment>
  );
};

export default ConfirmOrder;
