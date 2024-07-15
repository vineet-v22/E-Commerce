import React, { Fragment, useState } from 'react';
import './Header.css';
import { SpeedDial, SpeedDialAction } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import profilePng from "../../../images/Profile.png";
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../../actions/userAction';
import { useAlert } from 'react-alert';
import { useDispatch } from 'react-redux';

const UserOptions = ({ user }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const alert = useAlert();

    const dashboard = () => navigate("/admin/dashboard");
    const orders = () => navigate("/orders");
    const account = () => navigate("/account");
    const logoutUser = () => {
        dispatch(logout());
        alert.success("Logout Successfully");
    };

    const options = [
        { icon: <ListAltIcon />, name: "Orders", func: orders },
        { icon: <PersonIcon />, name: "Profile", func: account },
        { icon: <ExitToAppIcon />, name: "Logout", func: logoutUser }
    ];

    if (user.role === "admin") {
        options.unshift({
            icon: <DashboardIcon />,
            name: 'Dashboard',
            func: dashboard,
        });
    }

    return (
        <Fragment>
            <Backdrop open={open} style={{zIndex: 10}}/>
            <SpeedDial
                ariaLabel='SpeedDial tooltip example'
                onClose={() => setOpen(false)}
                onOpen={() => setOpen(true)}
                open={open}
                direction='down'
                className='speedDial'
                style={{zIndex: 11}}
                icon={
                    <img
                        className='speedDialIcon'
                        src={user.avatar.url ? user.avatar.url : profilePng}
                        alt='Profile'
                    />
                }
            >
                {options.map((item) => (
                    <SpeedDialAction
                        key={item.name}
                        icon={item.icon}
                        tooltipTitle={item.name}
                        onClick={item.func}
                    />
                ))}
            </SpeedDial>
        </Fragment>
    );
};

export default UserOptions;