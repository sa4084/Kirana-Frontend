import React from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Product = ({ item, onAddToCart }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/product/${item._id}`);
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" component="div">
          {item.name}
        </Typography>
        <Typography variant="body1" color="textPrimary">
          Price: ${item.price}
        </Typography>
        <Button variant="outlined" color="primary" onClick={onAddToCart} sx={{ backgroundColor: 'green' }}>
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
};

export default Product;
