"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, TextField, Button, Typography } from '@mui/material';
import { useAuth } from "../../context/AuthContext";

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [lote, setLote] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, lote }),
      });

      const data = await response.json();
      if (response.ok) {
        const userData = data.user;
        console.log("User data to be stored: ", userData); // Verifica la estructura de los datos del usuario
        localStorage.setItem("user", JSON.stringify(userData));
        login(userData); // Pasa los datos del usuario al método login
        alert('Registro exitoso');
        router.push('/');
      } else {
        setError(data.error);
      }
    } catch (err) {
      console.log(err);
      setError('Error al registrar usuario');
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>
        Registrarse
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <form onSubmit={handleRegister}>
        <TextField
          label="Nombre"
          type="text"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <TextField
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          label="Contraseña"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <TextField
          label="Lote"
          type="text"
          fullWidth
          margin="normal"
          value={lote}
          onChange={(e) => setLote(e.target.value)}
          required
        />
        <Button variant="contained" color="primary" type="submit">
          Registrarse
        </Button>
      </form>
    </Container>
  );
}
