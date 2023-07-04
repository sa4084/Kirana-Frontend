import React from 'react';
import { Typography, Container } from '@mui/material';
import { auth } from '../firebase';
import { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';


const SuccessPage = (isLogin) => {
  const navigate = useNavigate();
  console.log(process.env.REACT_APP_SERVER + '/orders');
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
  return (
    <Container maxWidth="md">
      <Typography variant="h5" component="div" align="center" gutterBottom>
        Order Confirmation
      </Typography>
      <Typography variant="body1" component="div" gutterBottom>
        Thank you for your order! Your order has been confirmed
      </Typography>
    </Container>
  );
};

export default SuccessPage;
