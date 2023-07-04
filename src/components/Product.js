import React, { useState } from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';

const Product = ({ item, onAddToCart }) => {
  const { name, description, price, image } = item;
  const [showDetails, setShowDetails] = useState(false);

  const handleAddToCartClick = () => {
    onAddToCart(item);
  };

  const handleProductClick = () => {
    // setShowDetails(true);
  };

  const handleBackClick = () => {
    setShowDetails(false);
  };

  if (showDetails) {
    return (
      <Card>
        <CardContent>
          <img src={image} alt={name} style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }} />
          <Typography variant="h6" component="div">
            {name}
          </Typography>
          {description && (
            <Typography variant="body2" color="textSecondary">
              {description}
            </Typography>
          )}
          <Typography variant="body1" color="textPrimary">
            Price: ${price}
          </Typography>
        </CardContent>
        <Button variant="contained" color="primary" onClick={handleBackClick} >
          Back
        </Button>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent style={{ height: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <img src={image} alt={name} style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain'}} />
        <Typography variant="h6" component="div">
          {name}
        </Typography>
        <Typography variant="h6" color="primary" onClick={handleProductClick}>
        ${price}
        </Typography>
        <Button variant="small" color="primary" onClick={handleAddToCartClick} >
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
};

export default Product;
