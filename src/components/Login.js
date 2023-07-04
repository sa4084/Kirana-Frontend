import React, { useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

const theme = createTheme();

const AuthPage = ({ isLogin }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (error) {
      setError('Invalid email or password');
      console.error(error);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (error) {
      setError('Failed to create an account');
      console.error(error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="sm">
        <Card>
          <CardContent>
            <Typography variant="h5" component="div" align="center" gutterBottom>
              {isLogin ? 'Login' : 'Register'}
            </Typography>
            <form onSubmit={isLogin ? handleLogin : handleRegister}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Grid>
                {!isLogin && (
                  <Grid item xs={12}>
                    <TextField
                      label="Confirm Password"
                      type="password"
                      fullWidth
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </Grid>
                )}
                <Grid item xs={12}>
                  <Button variant="contained" color="primary" type="submit" fullWidth >
                    {isLogin ? 'Login' : 'Register'}
                  </Button>
                </Grid>
              </Grid>
              {error && (
                <Typography color="error" align="center" gutterBottom>
                  {error}
                </Typography>
              )}
            </form>
          </CardContent>
          <CardActions>
            <Typography variant="body2" component="div">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <Button color="primary" onClick={() => navigate(isLogin ? '/register' : '/login')} >
                {isLogin ? 'Register' : 'Login'}
              </Button>
            </Typography>
          </CardActions>
        </Card>
      </Container>
    </ThemeProvider>
  );
};

export default AuthPage;
