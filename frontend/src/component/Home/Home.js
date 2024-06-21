import React, { Fragment } from 'react'
import {CgMouse} from "react-icons/cg"
import "./Home.css"
import Product from "./Product.js"
import MetaData from "../layout/MetaData"

const product = {
    name:"Blue Tshirt",
    images:[{url: "https://images.pexels.com/photos/20787/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=350"
}],
    price:"$300",
    _id:"vineet"
};

const Home = () => {
    return (
        <Fragment>
            <MetaData title="E-Commerce"> </MetaData>
            <div className="banner">
                <p>
                    Welcome to E-Commerce
                </p>
                <h1>Find Amazing product below</h1>
                <a href="#container">
                    <button>
                        scroll <CgMouse/>
                    </button>
                </a>
            </div>
            <div className="homeHeading">Featured Products</div>

            <div className="container" id="container">
                <Product product = {product}/>
                <Product product = {product}/>
                <Product product = {product}/>
                <Product product = {product}/>
                <Product product = {product}/>
                <Product product = {product}/>
                <Product product = {product}/>
                <Product product = {product}/>
            </div>
        </Fragment>  
    );
}

export default Home
