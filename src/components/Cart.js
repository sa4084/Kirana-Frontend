import React, { useEffect, useState } from 'react';
import { Typography, Container, Grid, Card, CardContent, Button } from '@mui/material';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from "axios";
const { v4: uuidv4 } = require('uuid');


const Cart = (isLogin) => {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  

  useEffect(() => {
    // Check if user is logged in
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user && isLogin) {
        // User is not logged in and trying to access the dashboard, redirect to login
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [isLogin, navigate]);

  
  useEffect(() => {
    // Retrieve cart data from localStorage
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(storedCart);
  }, []);

  useEffect(() => {
    // Calculate subtotal
    const sub = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setSubtotal(sub);

    // Calculate tax (assuming 10% tax)
    // const taxAmount = sub * 0.1;

    // Calculate total (subtotal + tax + tip)
    const totalAmount = sub;
    setTotal(totalAmount);
    localStorage.setItem('total', JSON.stringify(totalAmount))
  }, [cartItems]);

  const handleRemoveFromCart = (itemId) => {
    // Logic to remove item from the cart
    console.log(itemId)
    const updatedCart = cartItems.filter((item) => item._id !== itemId);
    setCartItems(updatedCart);
    // Update the cart data in localStorage
    console.log(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    document.dispatchEvent(new Event("cartItemsUpdated"));

  };
  

  const handlePayNow = async () => {
    const timestamp = Date.now()
    const orderId = uuidv4()
    console.log(orderId)
    try {
      const response = await axios.post(process.env.REACT_APP_SERVER + '/payment/create-checkout-session', {
        cartItems,
        userId: user._id,
      });
      if (response.data.url) {
        try {
          const profileResponse = await fetch(process.env.REACT_APP_SERVER + `/profile/${user.email}`);
          const data = await profileResponse.json();
          if (data) {
            const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
            const storedTotal = parseFloat(localStorage.getItem('total')) || 0;
            // Make API call to post order details
            const orderData = {
              customerEmail: user.email,
              customerName: data.name,
              address: data.address,
              products: storedCart,
              phoneNumber: data.phoneNumber,
              totalPrice: storedTotal,
              timestamp: timestamp,
              orderId: orderId,
            };
            console.log("ordering update");
            await fetch(process.env.REACT_APP_SERVER + '/orders', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(orderData),
            });
  
          }
  
          localStorage.removeItem('cart');
          localStorage.removeItem('total');
        } catch (error) {
          console.error(error);
        }
  
        window.location.href = response.data.url;
      }
    } catch (err) {
      console.log(err.message);
    }
  };
  

  return (
    <Container maxWidth="md">
        <br/> <br/> <br/>
      {cartItems.length > 0 ? (
        <Grid container spacing={2}>
          {cartItems.map((item) => (
            <Grid item xs={12} key={item.id}>
              <Card style={{display: 'flex', flexDirection: 'column'}}>
                <CardContent style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                  <Typography variant="h6" component="div">
                    {item.name}
                    <Typography variant="body1" color="textPrimary">
                    Price: ${item.price} x {item.quantity}
                  </Typography>
                  </Typography>
                  <Button variant="filled" color="error" onClick={() => handleRemoveFromCart(item._id)}  >
                    <DeleteIcon/>
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="div">
                  Subtotal: ${subtotal.toFixed(2)}
                </Typography>
                {/* <Typography variant="body1" color="textPrimary">
                  Tax: ${tax.toFixed(2)}
                </Typography> */}
                {/* <Typography variant="body1" color="textPrimary">
                  Tip:
                  <TextField
                    type="number"
                    variant="outlined"
                    size="small"
                    value={tip}
                    onChange={handleTipChange}
                    style={{ marginLeft: '0.5rem' }}
                  />
                </Typography> */}
                <Typography variant="h6" component="div">
                Total: ${total.toFixed(2)}
                </Typography>
                <Button variant="contained" color="primary" onClick={handlePayNow}>
                  Pay Now
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : (
        <Typography variant="body1" align="center">
          Your cart is empty.
        </Typography>
      )}
    </Container>
  );
};

export default Cart;

