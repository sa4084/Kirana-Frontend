import React, { useEffect, useState } from 'react';
import { Container, Grid, TextField, Pagination } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import Product from './Product';

const Dashboard = ({ isLogin }) => {
  const [foodItems, setFoodItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

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
    // Fetch food items from the backend API
    const fetchFoodItems = async () => {
      try {
        const response = await fetch(process.env.REACT_APP_SERVER + `/products?page=${currentPage}`);
        const data = await response.json();
        setFoodItems(data.products);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error(error);
      }
    };

    fetchFoodItems();
  }, [currentPage]);

  useEffect(() => {
    // Retrieve cart data from localStorage
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(storedCart);
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleAddToCart = (item) => {
    // Check if the item already exists in the cart
    const itemExists = cart.find((cartItem) => cartItem._id === item._id);

    if (itemExists) {
      // If the item exists, update the quantity
      const updatedCart = cart.map((cartItem) =>
        cartItem._id === item._id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
      );
      setCart(updatedCart);
      // Save the updated cart to localStorage
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    } else {
      // If the item doesn't exist, add it to the cart
      const updatedCart = [...cart, { ...item, quantity: 1 }];
      setCart(updatedCart);
      // Save the updated cart to localStorage
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    }
    document.dispatchEvent(new Event("cartItemsUpdated"));
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const filteredFoodItems = foodItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container maxWidth="md">
      <TextField
        label="Search Food Items"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={handleSearchChange}
        margin="normal"
      />
      <br/> <br/> <br/>
      <Grid container spacing={2}>
        {filteredFoodItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item._id}>
            <Product item={item} onAddToCart={handleAddToCart} />
          </Grid>
        ))}
      </Grid>
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={handlePageChange}
        style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}
      />
    </Container>
  );
};

export default Dashboard;
