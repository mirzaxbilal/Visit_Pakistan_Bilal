import React, { useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import "./Sidebar.css";
import Logo from "../imgs/logo.png";
import { UilSignOutAlt } from "@iconscout/react-unicons";
import { SidebarData } from "../Data/Data";
import { UilBars } from "@iconscout/react-unicons";
import { motion } from "framer-motion";

const Sidebar = () => {
  const [selected, setSelected] = useState(0);
  const [expanded, setExpaned] = useState(true);

  const navigate = useNavigate();
  const { user, dispatch } = useContext(AuthContext);

  const sidebarVariants = {
    true: {
      left : '0'
    },
    false:{
      left : '-60%'
    }
  }
  console.log(window.innerWidth)

  const handleMenuItemClick = (index, heading) => {
    setSelected(index);

    // Check if admin is logged in
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }

    // Navigate based on the clicked item
    switch (heading) {
      case "Dashboard":
        navigate('/dashboard');
        break;
      case "Users":
        navigate('/userTable');
        break;
      case "Packages":
        navigate('/package-confirmation');
        break;
      default:
        break;
    }
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      localStorage.removeItem('user');
      dispatch({ type: 'LOGOUT' });
      navigate('/login');
    }
  };

  return (
    <>
      <div className="bars" style={expanded ? { left: '60%' } : { left: '5%' }} onClick={() => setExpaned(!expanded)}>
        <UilBars />
      </div>
      <motion.div className='sidebar'
        variants={sidebarVariants}
        animate={window.innerWidth <= 768 ? `${expanded}` : ''}
      >
        <div className="logo">
          <img src={Logo} alt="logo" />
        </div>
        <div className="menu">
          {SidebarData.map((item, index) => (
            <div
              className={selected === index ? "menuItem active" : "menuItem"}
              key={index}
              onClick={() => handleMenuItemClick(index, item.heading)}
            >
              <item.icon />
              <span>{item.heading}</span>
            </div>
          ))}
          <div className="menuItem" onClick={handleLogout}>
            <UilSignOutAlt />
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;
