import './App.css';
import Header from "./component/layout/Header/Header.js";
import Footer from "./component/layout/Footer/Footer.js";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import WebFont from "webfontloader";
import React, { useState, useEffect } from 'react';
import Home from "./component/Home/Home.js";
import Loader from './component/layout/Loader/Loader.js';
import ProductDetails from './component/Product/ProductDetails.js';
import Products from './component/Product/Products.js';
import Search from "./component/Product/Search.js";
import LoginSignUp from './component/User/LoginSignUp.js';
import store from "./store.js";
import { loadUser } from './actions/userAction.js';
import UserOptions from "./component/layout/Header/UserOptions.js";
import { useSelector } from 'react-redux';
import Profile from "./component/User/Profile.js";
import ProtectedRoute from './component/Route/ProtectedRoute.js';
import UpdateProfile from "./component/User/UpdateProfile.js";
import UpdatePassword from "./component/User/UpdatePassword.js";
import ForgotPassword from './component/User/ForgotPassword.js';
import ResetPassword from './component/User/ResetPassword.js';
import Cart from "./component/Cart/Cart.js";
import Shipping from "./component/Cart/Shipping.js";
import ConfirmOrder from "./component/Cart/ConfirmOrder.js";
import axios from 'axios';
import Payment from "./component/Cart/Payment.js";
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import OrderSuccess from "./component/Cart/OrderSuccess.js";
import MyOrders from "./component/Order/MyOrders.js";
import OrderDetails from "./component/Order/OrderDetails.js"
import Dashboard from "./component/admin/Dashboard.js"
import ProductList  from "./component/admin/ProductList.js"
import NewProduct from './component/admin/NewProduct.js';
import UpdateProduct from './component/admin/UpdateProduct.js';
import OrderList from './component/admin/OrderList.js';
import ProcessOrder from './component/admin/ProcessOrder.js';
import UsersList from './component/admin/UsersList.js'
import UpdateUser from './component/admin/UpdateUser.js';
import ProductReviews from './component/admin/ProductReviews.js';
import Contact from '../src/component/layout/Contact/Contact.js';
import About from '../src/component/layout/About/About.js';
import NotFound from '../src/component/layout/NotFound/NotFound.js';

function App() {
  const { isAuthenticated, user, loading } = useSelector((state) => state.user);
  
  const [stripePromise, setStripePromise] = useState(null);

  const getStripeApiKey = async () => {
    try {
      const { data } = await axios.get("/api/v1/stripeapikey");
      setStripePromise(loadStripe(data.stripeApiKey));
    } catch (error) {
      console.error("Error fetching Stripe API key:", error);
    }
  };

  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      },
    });

    store.dispatch(loadUser());
    getStripeApiKey();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <Router>
      <Header />
      {isAuthenticated && user && <UserOptions user={user} />}
      
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/contact" element={<Contact />} />
        <Route exact path="/about" element={<About />} />
        <Route exact path="/sad" element={<Loader />} />
        <Route exact path="/product/:id" element={<ProductDetails />} />
        <Route exact path="/products" element={<Products />} />
        <Route path="/Products/:keyword" element={<Products />} />
        <Route exact path="/search" element={<Search />} />
        <Route exact path="/login" element={<LoginSignUp />} />
        <Route exact path="/password/forgot" element={<ForgotPassword />} />
        <Route exact path="/password/reset/:token" element={<ResetPassword />} />
        <Route exact path="/cart" element={<Cart />} />
        
        <Route element={<ProtectedRoute />}>
          <Route exact path="/account" element={<Profile />} />
          <Route exact path="/me/update" element={<UpdateProfile />} />
          <Route exact path="/password/update" element={<UpdatePassword />} />
          <Route exact path="/shipping" element={<Shipping />} />
          <Route exact path="/order/confirm" element={<ConfirmOrder />} />
          <Route exact path="/success" element={<OrderSuccess />} />
          <Route exact path="/orders" element={<MyOrders />} />
          <Route exact path="/order/:id" element={<OrderDetails />} />
          <Route isAdmin = {true} exact path="/admin/dashboard" element = {<Dashboard/>}/>
          <Route isAdmin = {true} exact path="/admin/products" element = {<ProductList/>}/>
          <Route isAdmin = {true} exact path="/admin/product" element = {<NewProduct/>}/>
          <Route isAdmin = {true} exact path="/admin/product/:id" element = {<UpdateProduct/>}/>
          <Route isAdmin = {true} exact path="/admin/orders" element = {<OrderList/>}/>
          <Route isAdmin = {true} exact path="/admin/order/:id" element = {<ProcessOrder/>}/>
          <Route isAdmin = {true} exact path="/admin/users" element = {<UsersList/>}/>
          <Route isAdmin = {true} exact path="/admin/user/:id" element = {<UpdateUser/>}/>
          <Route isAdmin = {true} exact path="/admin/reviews" element = {<ProductReviews/>}/>
          {stripePromise && (
            <Route
              exact
              path="/process/payment"
              element={
                <Elements stripe={stripePromise}>
                  <Payment />
                </Elements>
              }
            />
          )}
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      <Footer />
    </Router>
  );
}

export default App;
