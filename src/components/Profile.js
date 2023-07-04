import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, FormControl, FormHelperText, Input } from '@mui/material';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const Profile = (isLogin) => {
  const [user] = useAuthState(auth);
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');
  const [address, setAddress] = useState('');
  const [addressError, setAddressError] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
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
    if (user) {
      // Fetch user profile data from the backend API
      fetch(process.env.REACT_APP_SERVER + `/profile/${user.email}`)
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            setName(data.name);
            setAddress(data.address);
            setPhone(data.phoneNumber);
          }
        })
        .catch((error) => console.error(error));
    }
  }, [user]);

  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);

    if (!value) {
      setNameError('Name is required');
    } else {
      setNameError('');
    }
  };

  const handleAddressChange = (e) => {
    const value = e.target.value;
    setAddress(value);

    if (!value) {
      setAddressError('Address is required');
    } else {
      setAddressError('');
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    setPhone(value);

    if (!value) {
      setPhoneError('Phone is required');
    } else {
      setPhoneError('');
    }
  };

  const handleSave = () => {
    if (!name) {
      setNameError('Name is required');
    }

    if (!address) {
      setAddressError('Address is required');
    }

    if (!phone) {
      setPhoneError('Phone is required');
    }

    if (name && address && phone) {
      // Send POST request with updated details to the backend API
      fetch(process.env.REACT_APP_SERVER + '/profile', {
        method: 'POST',
        body: JSON.stringify({ emailId: user.email, name: name, address, phoneNumber: phone }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((data) => {
          // Update user details locally if the request is successful
          // setName(data.name);
          // setAddress(data.address);
          // setPhone(data.phoneNumber);
        })
        .catch((error) => console.error(error));
    }
  };

  return (
    <Container maxWidth="md" sx={{display: 'flex', flexDirection: 'column'}}>
        <br/> <br/> <br/>
      <Typography variant="h5" component="div" align="center" gutterBottom>
        Profile
      </Typography>
      {user ? (
        <div>
          {/* <Typography variant="subtitle1">Current UserName: {name}</Typography> */}
          <Typography variant="subtitle1" sx={{color: "red"}}>Email: {user.email}</Typography>
          {/* <Typography variant="subtitle1">Current Address: {address}</Typography> */}
          {/* <Typography variant="subtitle1">Current Phone: {phone}</Typography> */}
        </div>
      ) : (
        <Typography variant="subtitle1">User not logged in.</Typography>
      )}
      <div style={{ marginTop: '1rem' }}>
        <FormControl fullWidth margin="normal" error={!!nameError}>
        <Typography variant="subtitle1"> Current Username: &nbsp;
          <Input
            label="New Name"
            value={name}
            onChange={handleNameChange}
            error={!!nameError}
          />
          {nameError && <FormHelperText>{nameError}</FormHelperText>}
          </Typography>
        </FormControl>

        <FormControl fullWidth margin="normal" error={!!addressError}>
        <Typography variant="subtitle1"> Current Address: &nbsp;
          <Input
            label="New Address"
            value={address}
            onChange={handleAddressChange}
            error={!!addressError}
          />
          {addressError && <FormHelperText>{addressError}</FormHelperText>}
          </Typography>
        </FormControl>

        <FormControl fullWidth margin="normal" error={!!phoneError}>
        <Typography variant="subtitle1"> Current Phone Number: &nbsp;
          <Input
            label="New Phone"
            value={phone}
            onChange={handlePhoneChange}
            error={!!phoneError}
          />
          {phoneError && <FormHelperText>{phoneError}</FormHelperText>}
          </Typography>
        </FormControl>
        <br/> <br/>
        <Button variant="contained" color="primary" onClick={handleSave} >
          Update
        </Button>
      </div>
    </Container>
  );
};

export default Profile;
