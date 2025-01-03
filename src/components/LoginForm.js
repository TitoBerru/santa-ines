import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/navigation';
import { TextField, Button, Typography, CircularProgress } from '@mui/material';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const LoginForm = ({ setLoading }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setLoading(true);
    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      console.log('Response completa:', response);
      const data = await response.json();
      console.log('Datos recibidos del backend:', data);

      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
        login(data.user);
        toast.success('Login exitoso, cargando las publicaciones...', {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: false,
          pauseOnHover: false,
        });

        setTimeout(() => {
          router.push('/');
        }, 3000);
      } else {
        toast.error('Problemas con el correo o contraseña, por favor volver a intentar', {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: false,
          pauseOnHover: false,
        });

        setTimeout(() => {
          router.push('/');
        }, 3000);
        setLoading(false);
        localStorage.removeItem('user');
        setIsProcessing(false);
      }
    } catch (err) {
      console.log('Error durante el fetch:', err);
      setError('Error al iniciar sesión');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
      setIsProcessing(false);
    }
  };

  const handleSignUpRedirect = () => {
    router.push('/register');
  };

  return (
    <div style={{ textAlign: 'center' }}>
      {/* Logo */}
      <div className="logo-container">
        <Image
          src="/img/logo.webp"
          alt="Logo"
          width={100}
          height={100}
          className="logo"
        />
      </div>

      {/* Mensaje de bienvenida */}
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        style={{ color: '#333', fontWeight: 'bold' }}
      >
        Bienvenido a Santa Inés
      </Typography>
      <Typography variant="body1" gutterBottom style={{ color: '#555' }}>
        Por favor, inicia sesión para visualizar los temas del día.
      </Typography>

      {/* Formulario */}
      <form
        onSubmit={handleLogin}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <TextField
          type="email"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          variant="outlined"
          style={{
            backgroundColor: '#fff',
            marginBottom: '20px',
            width: '100%',
          }}
        />
        <TextField
          type="password"
          label="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          variant="outlined"
          style={{
            backgroundColor: '#fff',
            marginBottom: '20px',
            width: '100%',
          }}
        />
        <Button
          type="submit"
          variant="contained"
          disabled={isProcessing}
          style={{
            backgroundColor: isProcessing ? '#ccc' : '#88cc88',
            color: '#fff',
            padding: '10px 20px',
            fontWeight: 'bold',
          }}
        >
          {isProcessing ? <CircularProgress size={24} /> : "Iniciar Sesión"}
        </Button>
      </form>
      <Button
        onClick={handleSignUpRedirect}
        variant="text"
        style={{ marginTop: '20px', color: '#88cc88' }}
      >
        No tengo cuenta
      </Button>
    </div>
  );
};

LoginForm.propTypes = {
  setLoading: PropTypes.func.isRequired,
};

export default LoginForm;
