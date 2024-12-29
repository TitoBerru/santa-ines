'use client'

import { useState } from "react";
import { useAuth } from '../../context/AuthContext';
import { useRouter } from "next/navigation";
import { Container, Typography, TextField, Button } from "@mui/material";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Guardar usuario autenticado en localStorage
        localStorage.setItem("user", JSON.stringify(data.user));
        login(data.user); // Actualizar estado de autenticación
        alert("Inicio de sesión exitoso");
        router.push("/"); // Redirigir a la página principal
      } else {
        handleFirebaseError(data.error); // Manejar error de Firebase
        localStorage.removeItem("user"); // Asegurarse de que no se guarde un usuario no autenticado
      }
    } catch (err) {
      setError("Error al iniciar sesión");
      localStorage.removeItem("user"); // Asegurarse de que no se guarde un usuario no autenticado
    }
  };

  const handleFirebaseError = (errorCode) => {
    switch (errorCode) {
      case 'auth/invalid-credential':
        setError('Credenciales inválidas. Por favor, verifica tu información.');
        break;
      case 'auth/user-not-found':
        setError('Usuario no encontrado. Por favor, verifica tu email.');
        break;
      case 'auth/wrong-password':
        setError('Contraseña incorrecta. Por favor, intenta de nuevo.');
        break;
      default:
        setError('Ocurrió un error inesperado. Por favor, intenta de nuevo más tarde.');
    }
  };

  return (
    <Container
      maxWidth="sm"
      style={{
        textAlign: "center",
        padding: "50px",
        backgroundColor: "rgba(240, 255, 255, 0.9)", // Fondo pastel con transparencia
        borderRadius: "18px",
        backdropFilter: "blur(10px)",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
        marginTop: "100px",
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom style={{ color: "#333", fontWeight: "bold" }}>
        Iniciar Sesión
      </Typography>
      {error && <Typography variant="body1" style={{ color: 'red', marginBottom: "20px" }}>{error}</Typography>}
      <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <TextField
          type="email"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          variant="outlined"
          style={{ backgroundColor: "#fff", marginBottom: "20px", width: "100%" }}
        />
        <TextField
          type="password"
          label="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          variant="outlined"
          style={{ backgroundColor: "#fff", marginBottom: "20px", width: "100%" }}
        />
        <Button
          type="submit"
          variant="filled"
          style={{
            backgroundColor: "#88cc88", // Color pastel verde
            color: "#fff",
            padding: "10px 20px",
            fontWeight: "bold",
          }}
        >
          Iniciar Sesión
        </Button>
      </form>
    </Container>
  );
}
