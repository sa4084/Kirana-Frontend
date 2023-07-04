import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Outlet,
} from "react-router-dom";
import AuthPage from "./components/AuthPage.js";
import Dashboard from "./components/Dashboard";
import Profile from "./components/Profile";
import History from "./components/History";
import SuccessPage from "./components/Success.js";
import Cart from "./components/Cart"; // Import the Cart component
import {
  Button,
  AppBar,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  Badge,
  IconButton,
} from "@mui/material";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";
import { ShoppingCart } from "@mui/icons-material"; // Import the ShoppingCart ico
import SettingsIcon from "@mui/icons-material/Settings";
import { useState, useEffect } from "react";

const App = () => {
  const [user] = useAuthState(auth);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [cartItems, setCartItemsLength] = useState(0);

  useEffect(() => {

    const updateCartItems = () => {
      const cartItem1s = JSON.parse(localStorage.getItem("cart")) || [];
      setCartItemsLength(cartItem1s.length);
    };

    updateCartItems();

    // Subscribe to custom event
    const handleCartItemsUpdated = () => {
      updateCartItems();
    };
    document.addEventListener('cartItemsUpdated', handleCartItemsUpdated);
  
    // Clean up the event listener
    return () => {
      document.removeEventListener('cartItemsUpdated', handleCartItemsUpdated);
    };

  }, []);

  const handleSignOut = () => {
    auth.signOut();
    handleProfileClose(); // Close the menu
  };
  console.log(user);
  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setAnchorEl(null);
  };

  return (
    <Router>
      <div>
        <AppBar position="static" sx={{ backgroundColor: "green" }}>
          <Toolbar>
            <Typography
              variant="h6"
              component={Link}
              to={user ? "/dashboard" : "/login"}
              style={{ textDecoration: "none", color: "white" }}
            >
              Kirana
            </Typography>
            <div style={{ marginLeft: "auto" }}>
              {user && (
                <div>
                  <IconButton color="inherit" component={Link} to="/cart">
                    {" "}
                    {/* Use IconButton instead of Button */}
                    <Badge
                    
                      color="error"
                      badgeContent={cartItems}
                    >
                      {" "}
                      {/* Display the count of added items as a badge */}
                      <ShoppingCart />
                    </Badge>
                  </IconButton>
                  <Button
                    color="inherit"
                    onClick={handleProfileClick}
                    sx={{ backgroundColor: "green" }}
                  >
                    <SettingsIcon />
                  </Button>
                  <Menu
                    id="profile-menu"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleProfileClose}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                  >
                    <MenuItem
                      component={Link}
                      to="/profile"
                      onClick={handleProfileClose}
                    >
                      Profile
                    </MenuItem>
                    <MenuItem
                      component={Link}
                      to="/history"
                      onClick={handleProfileClose}
                    >
                      Order History
                    </MenuItem>
                    <MenuItem
                      component={Link}
                      to="/login"
                      onClick={handleSignOut}
                    >
                      Sign Out
                    </MenuItem>
                  </Menu>
                </div>
              )}
            </div>
          </Toolbar>
        </AppBar>
        <Outlet />
        <Routes>
          <Route path="/" element={<AuthPage isLogin />} />
          <Route path="/login" element={<AuthPage isLogin />} />
          <Route path="/register" element={<AuthPage isLogin={false} />} />
          {true ? (
            <>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/history" element={<History />} />
              <Route path="/success" element={<SuccessPage />} />
              <Route path="/cart" element={<Cart />} />
            </>
          ) : (
            <Route path="*" element={<AuthPage isLogin />} />
          )}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
