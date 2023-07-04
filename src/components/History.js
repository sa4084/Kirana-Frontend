import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const History = (isLogin) => {
  const navigate = useNavigate();

  const [user] = useAuthState(auth);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

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
    // Fetch order history for the current user
    fetch(`http://localhost:8000/orders/${user.email}`)
      .then((response) => response.json())
      .then((data) => {
        setOrders(data);
      })
      .catch((error) => console.error(error));
  }, [user]);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
  };

  const handleCloseDetails = () => {
    setSelectedOrder(null);
  };

  return (
    <Container maxWidth="md">
      <br /> <br /> <br />
      {orders.length === 0 ? (
        <Typography variant="body1" align="center">
          No orders found.
        </Typography>
      ) : (
        <List>
          {orders.map((order) => (
            <ListItem key={order._id} sx={{ border: '1px solid #ccc', borderRadius: '5px', mb: 2 }}>
              <ListItemText
                primary={`Order ID: ${order.orderId}`}
                secondary={
                  <React.Fragment>
                    <Typography component="span" variant="body2">
                      Customer Email: {order.customerEmail}
                    </Typography>
                    <br />
                    <Typography component="span" variant="body2">
                      Customer Name: {order.customerName}
                    </Typography>
                    <br />
                    <Typography component="span" variant="body2">
                      Address: {order.address}
                    </Typography>
                    <br />
                    <Typography component="span" variant="body2">
                      Phone Number: {order.phoneNumber}
                    </Typography>
                    <br />
                    <Typography component="span" variant="body2">
                      Total Price: {order.totalPrice}
                    </Typography>
                    <br />
                    <Typography component="span" variant="body2">
                      Timestamp: {new Date(order.timestamp).toLocaleString()}
                    </Typography>
                    <br />
                    <Button onClick={() => handleViewDetails(order)}>View Details</Button>
                  </React.Fragment>
                }
              />
            </ListItem>
          ))}
        </List>
      )}

      <Dialog open={!!selectedOrder} onClose={handleCloseDetails}>
        <DialogTitle>Order Details</DialogTitle>
        {selectedOrder && (
          <DialogContent>
            <DialogContentText>
              {selectedOrder.products.map((product, index) => (
                <Box
                  key={index}
                  display="flex"
                  justifyContent="space-between"
                  sx={{ border: '1px solid #ccc', borderRadius: '5px', padding: '5px', mb: 2 }}
                >
                  <Typography component="span">{product.name} &nbsp;</Typography>
                  <Typography component="span">Quantity: {product.quantity}&nbsp;</Typography>
                  <Typography component="span">Price: {product.price}</Typography>
                </Box>
              ))}
            </DialogContentText>
          </DialogContent>
        )}
        <DialogActions>
          <Button onClick={handleCloseDetails}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default History;
