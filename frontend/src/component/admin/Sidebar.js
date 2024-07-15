import React, { useState } from "react";
import "./sidebar.css";
import logo from "../../images/logo.png";
import { Link } from "react-router-dom";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import PostAddIcon from "@mui/icons-material/PostAdd";
import AddIcon from "@mui/icons-material/Add";
import ListAltIcon from "@mui/icons-material/ListAlt";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import RateReviewIcon from "@mui/icons-material/RateReview";

const Sidebar = () => {
  const [expandProducts, setExpandProducts] = useState(false);

  return (
    <div className="sidebar">
      <Link to="/">
        <img src={logo} alt="Ecommerce" />
      </Link>
      <Link to="/admin/dashboard">
        <p>
          <DashboardIcon /> Dashboard
        </p>
      </Link>
      <div className="sidebar-item">
        <div className="sidebar-item-header" onClick={() => setExpandProducts(!expandProducts)}>
          <p>
            {expandProducts ? <ExpandMoreIcon /> : <ChevronRightIcon />} Products
          </p>
        </div>
        {expandProducts && (
          <div className="sidebar-item-content">
            <Link to="/admin/products">
              <p>
                <PostAddIcon /> All
              </p>
            </Link>
            <Link to="/admin/product">
              <p>
                <AddIcon /> Create
              </p>
            </Link>
          </div>
        )}
      </div>
      <Link to="/admin/orders">
        <p>
          <ListAltIcon />
          Orders
        </p>
      </Link>
      <Link to="/admin/users">
        <p>
          <PeopleIcon /> Users
        </p>
      </Link>
      <Link to="/admin/reviews">
        <p>
          <RateReviewIcon />
          Reviews
        </p>
      </Link>
    </div>
  );
};

export default Sidebar;
